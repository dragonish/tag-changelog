function parseRevertBody(body) {
  const match = body.match(/[a-f0-9]{40}/i);
  if (match) {
    return match[0];
  }
  return null;
}

module.exports = parseRevertBody;
