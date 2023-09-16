// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import {ICollectNFT} from '../interfaces/ICollectNFT.sol';
import {IPoPPHub} from '../interfaces/IPoPPHub.sol';
import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import {Errors} from '../libraries/Errors.sol';
import {Events} from '../libraries/Events.sol';
import {PoPPNFTBase} from './base/PoPPNFTBase.sol';
import {ERC721Enumerable} from './base/ERC721Enumerable.sol';

contract CollectNFT is PoPPNFTBase, ICollectNFT {
    address public immutable HUB;

    uint256 internal _profileId;
    uint256 internal _pubId;
    uint256 internal _tokenIdCounter;

    bool private _initialized;

    uint256 internal _royaltyBasisPoints;

    // bytes4(keccak256('royaltyInfo(uint256,uint256)')) == 0x2a55205a
    bytes4 internal constant INTERFACE_ID_ERC2981 = 0x2a55205a;
    uint16 internal constant BASIS_POINTS = 10000;

    constructor(address hub) {
        if (hub == address(0)) revert Errors.InitParamsInvalid();
        HUB = hub;
        _initialized = true;
    }

    function initialize(
        uint256 profileId,
        uint256 pubId,
        string calldata name,
        string calldata symbol
    ) external override {
        if (_initialized) revert Errors.Initialized();
        _initialized = true;
        _royaltyBasisPoints = 1000; // 10% of royalties
        _profileId = profileId;
        _pubId = pubId;
        super._initialize(name, symbol);
        emit Events.CollectNFTInitialized(profileId, pubId, block.timestamp);
    }

    function mint(address to) external override returns (uint256) {
        if (msg.sender != HUB) revert Errors.NotHub();
        unchecked {
            uint256 tokenId = ++_tokenIdCounter;
            _mint(to, tokenId);
            return tokenId;
        }
    }

    function getSourcePublicationPointer() external view override returns (uint256, uint256) {
        return (_profileId, _pubId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) revert Errors.TokenDoesNotExist();
        return IPoPPHub(HUB).getContentURI(_profileId, _pubId);
    }

    function setRoyalty(uint256 royaltyBasisPoints) external {
        if (IERC721(HUB).ownerOf(_profileId) == msg.sender) {
            if (royaltyBasisPoints > BASIS_POINTS) {
                revert Errors.InvalidParameter();
            } else {
                _royaltyBasisPoints = royaltyBasisPoints;
            }
        } else {
            revert Errors.NotProfileOwner();
        }
    }

    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        returns (address, uint256)
    {
        return (IERC721(HUB).ownerOf(_profileId), (salePrice * _royaltyBasisPoints) / BASIS_POINTS);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721Enumerable)
        returns (bool)
    {
        return interfaceId == INTERFACE_ID_ERC2981 || super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId);
        IPoPPHub(HUB).emitCollectNFTTransferEvent(_profileId, _pubId, tokenId, from, to);
    }
}
