const ProductRegistry = artifacts.require("ProductRegistry");

module.exports = function (deployer) {
  deployer.deploy(ProductRegistry).then(function (instance) {
    console.log("ProductRegistry deployed at address:", instance.address);
    console.log("Copy this address to src/utils/web3.ts CONTRACT_ADDRESS");
  });
};
