function sendSSE(res, generator, meta = {}) {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  (async () => {
    try {
      for await (const chunk of generator) {
        res.write(`data: ${JSON.stringify({ t: 'c', v: chunk })}\n\n`);
      }
      res.write(`data: ${JSON.stringify({ t: 'done', ...meta })}\n\n`);
    } catch (err) {
      res.write(`data: ${JSON.stringify({ t: 'err', message: err.message })}\n\n`);
    } finally {
      res.end();
    }
  })();
}

module.exports = { sendSSE };
