App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
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
    $.getJSON("AgroModel.json", function(agro_model) {
      // Instantiate a new truffle contract from the artifact
      // TODO:: what does it do ???
      App.contracts.AgroModel = TruffleContract(agro_model);
      // Connect provider to interact with contract
      App.contracts.AgroModel.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();

    });

  },


  render: function(){
    $('#AgroTemplate').show();
    App.setAccount();
    App.showActor();
    App.showProducts();
    App.initProductDelieryForm();
  },

  setAccount: function(){
    web3.eth.getAccounts(function(err, account) {
      if (err === null) {
        // todo: now manually setting accounts
        // 2 is farmer tanim
        // 3 is delivery man imran
        var account_no = 2;
        App.account = account[account_no];
        console.log ('account------>');
        console.log(App.account);

        $("#accountAddress").html("Your Account: " + App.account);
      }
    });
  },

  showActor: function(){
    console.log('----- 1');
      App.contracts.AgroModel.deployed()
      .then(function(agro_instance){
        console.log('----- 2');
        return agro_instance.actorAddressToActorStruct(App.account)
      })
      .then(function(actor_account){
        console.log('----- 3');
        if(actor_account[0] == 0){ // actor_account[0] is actorid. This means actor not present.
          $('#AgroAddActor').show();
          $('#AgroShowActor').hide();
        } else {
          console.log('----- 4');
          $('#AgroShowActor').show();
          $('#AgroAddActor').hide();
          console.log(actor_account);
          var actor_id = actor_account[0];
          var actor_name = actor_account[1];
          var actor_role = actor_account[2];

          console.log(actor_id);
          console.log(actor_name);


          $('#AgroShowActor').find('.actor_id').text(actor_id);
          $('#AgroShowActor').find('.actor_name').text(actor_name);
          $('#AgroShowActor').find('.actor_role').text(actor_role);
        }
      });
  },

  showProducts: function() {
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
              product_list.find('#' + product_hash[0]).html(product_hash[3] + ' - Owner: '+ product_hash[2]);
            } else {
              product_list.append('<div id="'+ product_hash[0] +'">' + product_hash[3] + ' - Owner: '+ product_hash[2] +'</div>');  
            }
          });
        });  
      }
    });
  },

  initProductDelieryForm: function(){
    App.contracts.AgroModel.deployed().
      then(function(agro_instance){
        return agro_instance.ownerToProductsCount(App.account);
      })
      .then(function(productsCount){
        for(i = 0; i < productsCount; i++){
          agro_instance.ownerToProductsId(App.account, i)
          .then(function(product_id){
            agro_instance.productIdToProductStruct(product_id)
            .then(function(product_hash){

              if($("#ProductDelivery .owners_products option[value='"+product_hash[0]+"']").length == 0) {
                $('#ProductDelivery .owners_products').append(new Option(product_hash[3], product_hash[0]))
              }
              
            });
          });  
        }
      });


      App.contracts.AgroModel.deployed().
      then(function(agro_instance){
        return agro_instance.actorsCount();
      })
      .then(function(actorsCount){
        for(i = 0; i < actorsCount; i++){
          agro_instance.actorAddresses(i)
          .then(function(actor_address){
            agro_instance.actorAddressToActorStruct(actor_address)
            .then(function(actor_hash){

              console.log('App.account');
              console.log(App.account);
              console.log('actor_hash[3]');
              console.log(actor_hash[3]);

              if( (App.account !=  actor_hash[3]) && ($("#ProductDelivery .actors option[value='"+actor_hash[0]+"']").length == 0) ) {
                $('#ProductDelivery .actors').append(new Option(actor_hash[1], actor_hash[0]))
              }
              
            });
          });  
        }
      });


  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.AgroModel.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      // todo

      // bindEvents();

      instance.ProductCreated({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        // App.render();
        App.render();
      });

      instance.ActorCreated({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        // App.render();
        App.render();
      });

    });
  },

  create_product: function() {

    console.log('----------- got this');

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
  },

  create_actor: function() {

    console.log('Executing create actor');


    var actor_name = $('#actor_name').val();
    var actor_role = $('#actor_role').val();

    console.log('Executing create actor 2');

    App.contracts.AgroModel.deployed().then(function(instance) {
      console.log('Executing create actor 3');
      console.log('App.account');
      console.log(App.account);
      console.log(5);
      return instance.createActor(actor_name, actor_role, { from: App.account, gas:3000000 });
      console.log(6);
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();

      alert('Actor Created with id: ' + result);

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
