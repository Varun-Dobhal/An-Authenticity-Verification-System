// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ProductRegistry {
    struct Product {
        string id;
        string name;
        string manufacturer;
        string description;
        uint256 price;
        string category;
        address registeredBy;
        uint256 createdAt;
        uint256 scanCount;
        uint256 lastScanned;
        bool isActive;
    }
    
    mapping(string => Product) public products;
    mapping(string => bool) public productExists;
    string[] public productHashes;
    
    address public owner;
    uint256 public totalProducts;
    uint256 public totalScans;
    
    event ProductRegistered(
        string indexed productHash,
        string name,
        string manufacturer,
        address indexed registeredBy,
        uint256 timestamp
    );
    
    event ProductScanned(
        string indexed productHash,
        address indexed scannedBy,
        uint256 scanCount,
        uint256 timestamp
    );
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier productMustExist(string memory productHash) {
        require(productExists[productHash], "Product does not exist");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        totalProducts = 0;
        totalScans = 0;
    }
    
    function registerProduct(
        string memory productHash,
        string memory id,
        string memory name,
        string memory manufacturer,
        string memory description,
        uint256 price,
        string memory category
    ) public {
        require(!productExists[productHash], "Product already exists");
        require(bytes(name).length > 0, "Product name cannot be empty");
        require(bytes(manufacturer).length > 0, "Manufacturer cannot be empty");
        require(price > 0, "Price must be greater than 0");
        
        products[productHash] = Product({
            id: id,
            name: name,
            manufacturer: manufacturer,
            description: description,
            price: price,
            category: category,
            registeredBy: msg.sender,
            createdAt: block.timestamp,
            scanCount: 0,
            lastScanned: 0,
            isActive: true
        });
        
        productExists[productHash] = true;
        productHashes.push(productHash);
        totalProducts++;
        
        emit ProductRegistered(productHash, name, manufacturer, msg.sender, block.timestamp);
    }
    
    function scanProduct(string memory productHash) 
        public 
        productMustExist(productHash) 
        returns (uint256) 
    {
        products[productHash].scanCount++;
        products[productHash].lastScanned = block.timestamp;
        totalScans++;
        
        emit ProductScanned(
            productHash, 
            msg.sender, 
            products[productHash].scanCount, 
            block.timestamp
        );
        
        return products[productHash].scanCount;
    }
    
    function getProduct(string memory productHash) 
        public 
        view 
        productMustExist(productHash) 
        returns (Product memory) 
    {
        return products[productHash];
    }
    
    function getAllProductHashes() public view returns (string[] memory) {
        return productHashes;
    }
    
    function getProductsByManufacturer(address manufacturer) 
        public 
        view 
        returns (string[] memory) 
    {
        uint256 count = 0;
        
        // Count products by manufacturer
        for (uint256 i = 0; i < productHashes.length; i++) {
            if (products[productHashes[i]].registeredBy == manufacturer) {
                count++;
            }
        }
        
        // Create array of matching product hashes
        string[] memory manufacturerProducts = new string[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < productHashes.length; i++) {
            if (products[productHashes[i]].registeredBy == manufacturer) {
                manufacturerProducts[index] = productHashes[i];
                index++;
            }
        }
        
        return manufacturerProducts;
    }
    
    function deactivateProduct(string memory productHash) 
        public 
        productMustExist(productHash) 
    {
        require(
            products[productHash].registeredBy == msg.sender || msg.sender == owner,
            "Only product owner or contract owner can deactivate"
        );
        
        products[productHash].isActive = false;
    }
    
    function getTotalStats() public view returns (uint256, uint256) {
        return (totalProducts, totalScans);
    }
}