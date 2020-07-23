//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;

contract Erc20PartyToken {

  // Datastructures holding internal state
  mapping (address => uint256) public balanceOf;
  mapping (address => mapping (address => uint256)) allowed; // provider2spender2balance

  // Events
  event Transfer(address indexed from, address indexed to, uint256 value);
  event ApprovalEvent(address indexed _owner, address indexed _spender, uint256 _value);
  event Deployed(address indexed _admin, uint256 indexed _totalSupply, string _name);

  string public name;
  string public symbol;
  address public admin; // TODO: Remove 
  uint8 public decimals;
  uint256 private totalSupply_;

  constructor(string memory _tokenName, string memory _tokenSymbol, uint8 _decimals, uint256 _initialSupply) public {
    name = _tokenName;
    symbol = _tokenSymbol;
    decimals = _decimals;
    totalSupply_ = _initialSupply;

    admin = msg.sender; // TODO: REMOVE
    balanceOf[msg.sender] = totalSupply_;

    emit Deployed(msg.sender, totalSupply_, _tokenName);
  }

  function totalSupply() public view returns (uint256) {
    return totalSupply_;
  }

  function allowance(address _tokenOwner, address _spender) public view returns (uint256 remaining){
    return allowed[_tokenOwner][_spender];
  }

   // The following two functions do not check for overflow.
  function mint(address account, uint256 amount) public returns (bool success){
    //require(msg.sender == admin, "ERC20: only admin can mint");
    balanceOf[account] += amount;
    totalSupply_ += amount;
    emit Transfer(address(0), account, amount);
    return true;
  }

  function burn(address account, uint256 amount) public returns (bool success){
    //require(msg.sender == admin, "ERC20: Only admin can burn");
    balanceOf[account] -= amount;
    totalSupply_ -= amount;
    emit Transfer(account, address(0), amount);
    return true;
  }

  function transfer(address _to, uint256 _value) public returns (bool success){
    // Check if the sufficient balance is present
    if (balanceOf[msg.sender] < _value) return false;

     // check for overflow
    if (balanceOf[_to] + _value < balanceOf[_to]) return false;

    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
    emit Transfer(msg.sender, _to, _value);

    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
    // Check if the sufficient balance is present
    if (balanceOf[_from] < _value) return false;

    // Check if msg.sender has been approved to transfer from _from
    require((allowed[_from][msg.sender] >= _value));

    // Check for overflow
    if (balanceOf[_to] + _value < balanceOf[_to]) return false;

    // Transfer the tokens and subtract from the allowance
    allowed[_from][msg.sender] -= _value;
    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;
    emit Transfer(msg.sender, _to, _value);

    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool success){
    allowed[msg.sender][_spender] = _value;
    emit ApprovalEvent(msg.sender, _spender, _value);
    return true;
  }
}
