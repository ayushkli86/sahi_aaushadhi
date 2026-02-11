// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MedicineVerification {
    struct Medicine {
        string productId;
        string name;
        string manufacturer;
        uint256 manufactureDate;
        uint256 expiryDate;
        address registeredBy;
        bool isVerified;
    }

    mapping(string => Medicine) public medicines;
    mapping(string => bool) public productExists;

    event MedicineRegistered(
        string indexed productId,
        string name,
        string manufacturer,
        address registeredBy
    );

    event MedicineVerified(string indexed productId, address verifiedBy);

    function registerMedicine(
        string memory _productId,
        string memory _name,
        string memory _manufacturer,
        uint256 _manufactureDate,
        uint256 _expiryDate
    ) public {
        require(!productExists[_productId], "Product already registered");
        require(_expiryDate > _manufactureDate, "Invalid dates");

        medicines[_productId] = Medicine({
            productId: _productId,
            name: _name,
            manufacturer: _manufacturer,
            manufactureDate: _manufactureDate,
            expiryDate: _expiryDate,
            registeredBy: msg.sender,
            isVerified: true
        });

        productExists[_productId] = true;

        emit MedicineRegistered(_productId, _name, _manufacturer, msg.sender);
    }

    function verifyMedicine(string memory _productId) public view returns (
        bool exists,
        string memory name,
        string memory manufacturer,
        uint256 manufactureDate,
        uint256 expiryDate,
        bool isVerified
    ) {
        require(productExists[_productId], "Product not found");

        Medicine memory med = medicines[_productId];
        return (
            true,
            med.name,
            med.manufacturer,
            med.manufactureDate,
            med.expiryDate,
            med.isVerified
        );
    }

    function getMedicine(string memory _productId) public view returns (Medicine memory) {
        require(productExists[_productId], "Product not found");
        return medicines[_productId];
    }
}
