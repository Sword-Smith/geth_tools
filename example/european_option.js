web3.eth.defaultAccount = web3.eth.accounts[0];
me = web3.eth.accounts[0];
other = web3.eth.accounts[1];

function sleep(ms) {
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < ms);
    //return new Promise(function( resolve ){
    //    setTimeout(resolve, ms);
    //})
}

var balanceMe = Erc20_DAI.balanceOf(me);
var balanceOther = Erc20_DAI.balanceOf(other);
console.log("Initial balance: " + balanceMe);

Erc20_DAI.approve(European_option_.address, 50);

European_option_.activate();


balanceMe = Erc20_DAI.balanceOf(me);
console.log("New balance: " + balanceMe);

sleep(3100);

DataFeed0_.set(0, 200);

European_option_.execute();

balanceMe = Erc20_DAI.balanceOf(me);
balanceOther = Erc20_DAI.balanceOf(other);
console.log("Final balance me: " + balanceMe);
console.log("Final balance other: " + balanceOther);

