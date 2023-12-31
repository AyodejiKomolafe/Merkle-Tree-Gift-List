const axios = require("axios");
const niceList = require("../utils/niceList.json");
const MerkleTree = require("../utils/MerkleTree");

const serverUrl = "http://localhost:1225";

async function main() {
  // TODO: how do we prove to the server we're on the nice list?
  const merkleTree = new MerkleTree(niceList);
  const root = merkleTree.getRoot();

  function getTheProof(theName) {
    const index = niceList.findIndex((n) => n === theName);
    const p = merkleTree.getProof(index);
    return p;
  }

  if (process.argv.length < 3) {
    console.error(
      "please type a longer name to verify as a command-line argument"
    );
    process.exit(1);
  }
  const name = process.argv.slice(2).join(" ");
  const proof = getTheProof(name);

  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    // TODO: add request body parameters here!
    name: name,
    proof: proof,
  });
  console.log({ gift });
  console.log({ name });
}

main();
