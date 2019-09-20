var Migrations = artifacts.require("./AgroModel.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
