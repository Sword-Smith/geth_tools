//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.9;

contract DataFeed1 {
  uint256 price;

  function set(bytes32 /** _key */, uint256 _price) public {
    price = _price;
  }

  function get(bytes32 /** _key */) public view returns (uint256 _price){
    return price;
  }
}