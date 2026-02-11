// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title MedicineVerification
 * @dev Smart contract for medicine authentication and QR verification
 * @notice This contract stores medicine records and QR hashes on-chain
 */
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

    // Medicine records
    mapping(string => Medicine) public medicines;
    mapping(string => bool) public productExists;

    // QR hash verification (tamper-proof)
    mapping(bytes32 => bool) public validQR;
    mapping(bytes32 => string) public qrToProduct;

    event MedicineRegistered(
        string indexed productId,
        string name,
        string manufacturer,
        address registeredBy
    );

    event MedicineVerified(string indexed productId, address verifiedBy);

    event QRRegistered(bytes32 indexed qrHash, string productId);

    /**
     * @dev Register a new medicine product
     */
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

    /**
     * @dev Register QR hash for a product (one-time use)
     */
    function registerQR(bytes32 _qrHash, string memory _productId) public {
        require(productExists[_productId], "Product not found");
        require(!validQR[_qrHash], "QR already registered");

        validQR[_qrHash] = true;
        qrToProduct[_qrHash] = _productId;

        emit QRRegistered(_qrHash, _productId);
    }

    /**
     * @dev Verify if QR hash is valid
     */
    function verifyQR(bytes32 _qrHash) public view returns (bool) {
        return validQR[_qrHash];
    }

    /**
     * @dev Get product ID from QR hash
     */
    function getProductFromQR(bytes32 _qrHash) public view returns (string memory) {
        require(validQR[_qrHash], "Invalid QR hash");
        return qrToProduct[_qrHash];
    }

    /**
     * @dev Verify medicine exists and get basic info
     */
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

    /**
     * @dev Get complete medicine details
     */
    function getMedicine(string memory _productId) public view returns (Medicine memory) {
        require(productExists[_productId], "Product not found");
        return medicines[_productId];
    }
}
