import { PropTypes } from "prop-types";
// creating function which will be called recursively
const FileTreeNode = ({ fileName, nodes }) => {
  //   console.log(nodes, "nodesa");
  //   to check if current node is file or directory
  const isDir = !!nodes;
  return (
    <div style={{ marginLeft: "10px" }}>
      <p className={isDir ? "" : "file-node"}>{fileName}</p>
      {/* if have nodes */}
      {nodes && (
        <ul>
          {Object.keys(nodes).map((child) => {
            return (
              <li key={child}>
                <FileTreeNode fileName={child} nodes={nodes[child]} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// tree - will come from backend
const FileTree = ({ tree }) => {
  //   console.log(tree,"tree");
  return <FileTreeNode fileName="/" nodes={tree} />;
};

export default FileTree;
// whenever we work with files , always think of recursive solution, because tree works on recursive solution

FileTreeNode.propTypes = {
  fileName: PropTypes.string.isRequired,
  nodes: PropTypes.object,
};

FileTree.propTypes = {
  tree: PropTypes.object.isRequired,
};
