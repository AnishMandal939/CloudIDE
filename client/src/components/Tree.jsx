import { PropTypes } from "prop-types";
// creating function which will be called recursively
const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {
  //   to check if current node is file or directory
  const isDir = !!nodes;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation(); // to stop event bubbling
        if (isDir) return; // if it is not directory then return, because we don't want to emit event
        onSelect(path); // emit event
      }}
      style={{ marginLeft: "2px", display: "flex", gap: "5px"}}
    >
        {isDir ? <span>📂</span> : <span>📄</span>}
      <p className={isDir ? "" : "file-node"}>{fileName}</p>
      {/* if have nodes */}
      {nodes && fileName !== "node_modules" && (
        <ul>
          {Object.keys(nodes).map((child) => (
            <li key={child} className="list">
              <FileTreeNode
                fileName={child}
                nodes={nodes[child]}
                path={path + "/" + child}
                onSelect={onSelect}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// tree - will come from backend
const FileTree = ({ tree, onSelect }) => {
  //   console.log(tree,"tree");
  return <FileTreeNode fileName="/" nodes={tree} path="" onSelect={onSelect} />;
};

export default FileTree;
// whenever we work with files , always think of recursive solution, because tree works on recursive solution

FileTreeNode.propTypes = {
  fileName: PropTypes.string.isRequired,
  nodes: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
};

FileTree.propTypes = {
  tree: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};
