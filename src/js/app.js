App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.

    // TODO: need to find out how it works
    // $.getJSON('../pets.json', function(data) {
    //   var petsRow = $('#petsRow');
    //   var petTemplate = $('#petTemplate');

    //   for (i = 0; i < data.length; i ++) {
    //     petTemplate.find('.panel-title').text(data[i].name);
    //     petTemplate.find('img').attr('src', data[i].picture);
    //     petTemplate.find('.pet-breed').text(data[i].breed);
    //     petTemplate.find('.pet-age').text(data[i].age);
    //     petTemplate.find('.pet-location').text(data[i].location);
    //     petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

    //     petsRow.append(petTemplate.html());
    //   }
    // });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      console.log('got 1');

      // TODO 
      // App.web3Provider = web3.currentProvider;
      // web3 = new Web3(web3.currentProvider);


      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);


    } else {
      // Specify default instance if no web3 instance provided

     console.log('got 2'); 

      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    /*
     * Replace me...
     */

    $.getJSON("AgroModel.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      // TODO:: what does it do ???
      App.contracts.AgroModel = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.AgroModel.setProvider(App.web3Provider);

      App.listenForEvents();

      // return App.render();
    });

    return App.bindEvents();
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    // App.contracts.Election.deployed().then(function(instance) {
    //   // Restart Chrome if you are unable to receive this event
    //   // This is a known issue with Metamask
    //   // https://github.com/MetaMask/metamask-extension/issues/2393
    //   // todo
    //   instance.votedEvent({}, {
    //     fromBlock: 0,
    //     toBlock: 'latest'
    //   }).watch(function(error, event) {
    //     console.log("event triggered", event)
    //     // Reload when a new vote is recorded
    //     App.render();
    //   });
    // });
  },

  bindEvents: function() {
    $('#AgroTemplate').show();
    $(document).on('click', '.btn-adopt', App.handleAdopt);

  },

  markAdopted: function(adopters, account) {
    /*
     * Replace me...
     */
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    /*
     * Replace me...
     */
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
