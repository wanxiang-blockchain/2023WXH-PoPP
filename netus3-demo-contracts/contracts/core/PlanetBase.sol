// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import {DataTypes} from '../libraries/DataTypes.sol';
import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import {IPlanetBase} from "../interfaces/IPlanetBase.sol";

contract PlanetBase is IPlanetBase{

    address public POPP_HUB;

    address public PLANET_PROFILE;

    //baseId => BaseInfo
    mapping(uint256=>DataTypes.BaseInfo) internal _baseIdOfPlanet;

    //planetProfileId => count
    mapping(uint256=>uint256) public countBaseOfPlanet;

    uint256 internal _baseCounter;

    //===============================ERC721Enumerable.sol===============================
    //planetId => index => baseId
    mapping(uint256 => mapping(uint256 => uint256)) private _ownedBases;
    //baseId => planetId's index
    mapping(uint256 => uint256) private _ownedBasesIndex;
    uint256[] private _allBases;
    //baseId => _allToken's index
    mapping(uint256 => uint256) private _allBasesIndex;

    event CreatedBase(uint256 planetId, uint256 baseId, string name);

    constructor(address poppHubAddress, address planetProfile) {
        POPP_HUB = poppHubAddress;
        PLANET_PROFILE = planetProfile;
    }

    modifier onlyHub() {
        require(msg.sender == POPP_HUB, 'Not HUB.');
        _;
    }

    function baseInfo(uint256 baseId) public view returns(DataTypes.BaseInfo memory) {
        return _baseIdOfPlanet[baseId];
    }

    function createPlanetBase(DataTypes.BaseInfo calldata vars) public onlyHub returns(uint256){
        uint256 baseId = ++_baseCounter;
        _baseIdOfPlanet[baseId] = vars;
        countBaseOfPlanet[vars.planetProfileId] += 1;
        _addTokenToOwnerEnumeration(vars.planetProfileId, baseId);
        _addTokenToAllBasesEnumeration(baseId);
        emit CreatedBase(vars.planetProfileId, baseId, vars.name);
        return baseId;
    }

    function setAuth(uint256 baseId, address joinNft, address postNft) public {
        uint256 planetProfileId = _baseIdOfPlanet[baseId].planetProfileId;
        require(msg.sender == IERC721(PLANET_PROFILE).ownerOf(planetProfileId), 'Not planet owner.');
        _baseIdOfPlanet[baseId].joinNft = joinNft;
        _baseIdOfPlanet[baseId].postNft = postNft;
    }

    function authCheck(address _addr, uint256 baseId) public view returns (bool, bool){
        if (_addr == IERC721(POPP_HUB).ownerOf(_baseIdOfPlanet[baseId].planetProfileId)){
            return (true, true);
        }
        address joinNft = _baseIdOfPlanet[baseId].joinNft;
        address postNft = _baseIdOfPlanet[baseId].postNft;
        bool join = true;
        if (joinNft != address(0)){
            join = IERC721(joinNft).balanceOf(_addr) > 0;
        }

        bool post = true;
        if (postNft != address(0)){
            post = IERC721(postNft).balanceOf(_addr) > 0;
        }
        return (join, post);
    }

    function removePlanetBase(uint planetProfileId, uint baseId) public onlyHub {
        _removeTokenFromOwnerEnumeration(planetProfileId, baseId);
        _removeTokenFromAllBasesEnumeration(baseId);
        countBaseOfPlanet[planetProfileId] -= 1;
    }


    function _addTokenToOwnerEnumeration(uint256 planetId, uint256 tokenId) private {
        uint256 length = countBaseOfPlanet[planetId];
        _ownedBases[planetId][length] = tokenId;
        _ownedBasesIndex[tokenId] = length;
    }

    function _addTokenToAllBasesEnumeration(uint256 tokenId) private {
        _allBasesIndex[tokenId] = _allBases.length;
        _allBases.push(tokenId);
    }

    function _removeTokenFromOwnerEnumeration(uint256 planetId, uint256 tokenId) private {
        uint256 lastTokenIndex = countBaseOfPlanet[planetId] - 1;
        uint256 tokenIndex = _ownedBasesIndex[tokenId];

        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedBases[planetId][lastTokenIndex];

            _ownedBases[planetId][tokenIndex] = lastTokenId;
            _ownedBasesIndex[lastTokenId] = tokenIndex;
        }

        // This also deletes the contents at the last position of the array
        delete _ownedBasesIndex[tokenId];
        delete _ownedBases[planetId][lastTokenIndex];
    }

    function _removeTokenFromAllBasesEnumeration(uint256 tokenId) private {

        uint256 lastTokenIndex = _allBases.length - 1;
        uint256 tokenIndex = _allBasesIndex[tokenId];
        uint256 lastTokenId = _allBases[lastTokenIndex];

        _allBases[tokenIndex] = lastTokenId;
        _allBasesIndex[lastTokenId] = tokenIndex;

        delete _allBasesIndex[tokenId];
        _allBases.pop();
    }
}
