pragma solidity ^0.5.0;

contract AgroModel {

  struct Actor {
    bytes32 actorId;
    string name;
    string role;
    address accountAddress; // Ethereum address
    string physicalAddress; // Physical address, may be separated (more costly)
    // TODO: actor certification? ISO:9001?
  }

  struct Certification {
        bytes32 certificationId;
        string name;
        string imageUrl;
        // TODO: certification expiration date
        //bytes32 certificationActorId; // agency/company behind the certification
    }
  
  struct Product {
    bytes32 productId;
    bytes32 latestVersionId;
    bytes32[] versions;
    // bytes32[] certificationsIds;
    
    address owner;
    // address nextAuthorizedOwnerAddress;

    // TODO: standard product categories/descriptions
    // TODO: allow users to set favourite categories based on their industry
    // TODO: UPC/EAN codes, GS1 categories https://www.gs1.org/gpc/latest

    string name;
    string description;
  }

  struct ProductVersion {
    bytes32 versionId;
    bytes32 previousVersionId;
    uint creationDate;
    address owner; // used to keep track of who owned the product at that version (could be a "bytes32 actorId")
    string latitude;
    string longitude;
    string customJsonData;
  }


  /***********************
      MAPPINGS & STORAGE
    ***********************/

  mapping (bytes32 => Product) public productIdToProductStruct; // access a product struct directly from an ID
  bytes32[] public productIds; // access all product IDs
  uint public productsCount;

  mapping (bytes32 => ProductVersion) public versionIdToVersionStruct; // access a version struct from a version ID
  bytes32[] public productVersionIds; // access all version IDs


  mapping (address => bytes32[]) public ownerToProductsId; // access an account's products

  mapping (address => Actor) public actorAddressToActorStruct; // access an actor struct from its Eth address
  address[] public actorAddresses; // access all actor addresses
  uint public actorsCount;

  mapping (bytes32 => Certification) public certificationIdToCertificationStruct; // access a version struct from a version ID
  bytes32[] public certificationIds; // access all version IDs

  // TODO: list of god accounts (mapping? array?)
  address public godUser;
  address[] public certifingUsers;


  // TODO: handle certifying actors' addresses
  // (see https://etherscan.io/address/0x06012c8cf97bead5deae237070f9587f8e7a266d#code)
  mapping (address => bytes32[]) certifiersAddressToCertificationIds; // Certifing Actors to their certifications IDs


  /***********************
      FUNCTIONS
    ***********************/


  function createProduct(
      string memory _name,
      string memory _description
      // string _latitude,
      // string _longitude,
      // bytes32[] _certificationsIds,
      // string _customJsonData
    ) public returns (bytes32 productId) {


        // require(true, ‘Something bad happened’);
    
        // Generate a pseudo-random product ID
        // from the current time and the sender's address
        bytes32 newProductId = keccak256(abi.encodePacked(now, msg.sender));

        // Create product
        // var product = productIdToProductStruct[newProductId];

        productIdToProductStruct[newProductId] = Product(newProductId, '0', new bytes32[](0), msg.sender, _name, _description);

      

        // Define product
        // product.productId = newProductId;
        // product.latestVersionId = "0"; // temporary value that gets replaced in updateProduct()
        // product.versions = new bytes32[](0); // empty array at first
        // product.exists = true;
        // product.archived = false;
        // product.owner = msg.sender;

        // product.name = _name;
        // product.description = _description;
        // product.certificationsIds = _certificationsIds;

        // Add new product ID
        productIds.push(newProductId);

        // Add product ID to account
        ownerToProductsId[msg.sender].push(newProductId);

        productsCount++;

        // Create initial product version
        // updateProduct(newProductId, _latitude, _longitude, _customJsonData);

        // Fire an event to announce the creation of the product
        emit ProductCreated(newProductId, msg.sender);

        return newProductId;
    }

    event ProductCreated(bytes32 newProductId, address indexed owner);



    function createActor(
      string memory _name,
      string memory _role
    ) public returns (bytes32 actorId) {
    
        
        bytes32 newActorId = keccak256(abi.encodePacked(now, msg.sender));
        actorAddressToActorStruct[msg.sender] = Actor(newActorId, _name, _role, msg.sender, '');
        actorAddresses.push(msg.sender);
        actorsCount++;
        emit ActorCreated(newActorId, msg.sender);
        return newActorId;
    }

    event ActorCreated(bytes32 newActorId, address indexed owner);


    // function actorPresent() public returns (bool) {
    //     if (actorAddressToActorStruct[msg.sender].actorId == 0){
    //       return false;
    //     } else {
    //       return true;
    //     }
        
    // }








}
