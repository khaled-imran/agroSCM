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

    $.getJSON("AgroModel.json", function(agro_model) {
      // Instantiate a new truffle contract from the artifact
      // TODO:: what does it do ???
      App.contracts.AgroModel = TruffleContract(agro_model);
      // Connect provider to interact with contract
      App.contracts.AgroModel.setProvider(App.web3Provider);

      App.listenForEvents();

      // return App.render();
    });

    

    // App.listenForEvents();

    return App.bindEvents();
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.AgroModel.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      // todo
      instance.ProductCreated({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        // App.render();
        App.bindEvents();
      });
    });

    // var product_list = $('.product_list');

    // App.contracts.AgroModel.deployed().
    // then(function(instance){
    //   agro_instance = instance;
    //   return(agro_instance);
    // })
    // .then(function(agro_instance){
    //   console.log('agro_instance'); 
    //   console.log(agro_instance); 
    //   return agro_instance.productsCount();
    // })
    // .then(function(productsCount){
    //   for(i = 0; i < productsCount; i++){
    //     agro_instance.productIds(i)
    //     .then(function(product_id){
    //       agro_instance.productIdToProductStruct(product_id)
    //       .then(function(product_hash){
    //         product_list.append('<h1>' + product_hash[3] + '<h1>');      
    //       });
    //     });  
    //   }
    // });
  },

  bindEvents: function() {
    $('#AgroTemplate').show();
    $(document).on('click', '.btn-adopt', App.handleAdopt);

    

    web3.eth.getAccounts(function(err, account) {
      if (err === null) {
        // todo: now manually setting accounts
        var account_no = 2;
        App.account = account[account_no];
        $("#accountAddress").html("Your Account: " + App.account);
      }
    });


    // $.getJSON("AgroModel.json", function(agro_model) {
      // Instantiate a new truffle contract from the artifact
      // TODO:: what does it do ???
      // App.contracts.AgroModel = TruffleContract(agro_model);
      // Connect provider to interact with contract
      // App.contracts.AgroModel.setProvider(App.web3Provider);


      // TODO: for now for test purpose
      $('#AgroAddActor').show();
      App.contracts.AgroModel.deployed().
      then(function(instance){
        agro_instance = instance;
        return(agro_instance);
      })
      .then(function(agro_instance){
        console.log('agro_instance'); 
        console.log(agro_instance); 
        return agro_instance.actorAddresses();
      })
      .then(function(actor_address_array){
        for(i = 0; i < actor_address_array.length; i ++){
          console.log(actor_address_array[i]);
        }
      });

      var product_list = $('.product_list');
      App.contracts.AgroModel.deployed().
      then(function(instance){
        agro_instance = instance;
        return(agro_instance);
      })
      .then(function(agro_instance){
        console.log('agro_instance'); 
        console.log(agro_instance); 
        return agro_instance.productsCount();
      })
      .then(function(productsCount){
        for(i = 0; i < productsCount; i++){
          agro_instance.productIds(i)
          .then(function(product_id){
            agro_instance.productIdToProductStruct(product_id)
            .then(function(product_hash){

              console.log('sssssss');
              console.log(product_hash);

              if(product_list.find('#' + product_hash[0]).length){
                product_list.find('#' + product_hash[0]).text(product_hash[3]);
              } else {
                product_list.append('<h1 id="'+ product_hash[0] +'">' + product_hash[3] + ' - Owner: '+ product_hash[2] +'<h1>');  
              }
            });
          });  
        }
      });

      // return App.render();
    // });


    



    



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
  },

  create_product: function() {
    var product_name = $('#product_name').val();
    var product_description = $('#product_description').val();

    App.contracts.AgroModel.deployed().then(function(instance) {
      console.log('App.account');
      console.log(App.account);
      return instance.createProduct(product_name, product_description, { from: App.account, gas:3000000 });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();

      alert('Product Created with id: ' + result);

    }).catch(function(err) {
      console.error(err);
    });
  }


};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
