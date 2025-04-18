const parseRevertBody = require("./parseRevertBody");

function groupByType(commits, typeConfig) {
  const revertDict = {};
  commits.forEach(commit => {
    if (commit.type === "revert") {
      const hash = parseRevertBody(commit.body);
      if (hash) {
        revertDict[hash] = commit.sha;
      }
    }
  });

  const ignoreHashes = new Set();
  const revertHashes = Object.keys(revertDict);
  if (revertHashes.length > 0) {
    commits.forEach(commit => {
      if (revertHashes.includes(commit.sha)) {
        ignoreHashes.add(commit.sha);
        ignoreHashes.add(revertDict[commit.sha]);
      }
    });
  }

  // First, group all the commits by their types.
  // We end up with a dictionary where the key is the type, and the values is an array of commits.
  const byType = {};
  commits.forEach(commit => {
    if (ignoreHashes.has(commit.sha)) {
      return;
    }

    if (!byType[commit.type]) {
      byType[commit.type] = [];
    }
    byType[commit.type].push(commit);
  });

  // Turn that dictionary into an array of objects,
  // where the key is the type, and the values is an array of commits.
  const byTypeArray = [];
  Object.keys(byType).forEach(key => {
    byTypeArray.push({
      type: key,
      commits: byType[key],
    });
  });

  // And now we sort that array using the TYPES object.
  byTypeArray.sort((a, b) => {
    let aOrder = typeConfig.findIndex(t => t.types.includes(a.type));
    if (aOrder === -1) aOrder = 999;
    let bOrder = typeConfig.findIndex(t => t.types.includes(b.type));
    if (bOrder === -1) bOrder = 999;
    return aOrder - bOrder;
  });

  return byTypeArray;
}

module.exports = groupByType;
