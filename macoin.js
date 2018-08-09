//author @tomshy

const HASH=require('crypto-js/sha256');
class Transaction{
	constructor(fromAddr,toAddr,amount){
		this.fromAddr=fromAddr;
		this.toAddr=toAddr;
		this.amount=amount;
	}
}
class Block{//a block class
	constructor(transactions,timestamp,hashOfPreviousBlock=''){		
		this.transactions=transactions;//data of the block, can be coins or anything of value
		this.timestamp=timestamp;//time of block creating
		this.hashOfPreviousBlock=hashOfPreviousBlock;
		this.hash=this.calculateHash();
		this.nonce=0;
	}
	calculateHash(){//calculates a hash value using sha256 
		return HASH(this.index+this.hashOfPreviousBlock+this.timestamp+this.nonce+JSON.stringify(this.data)).toString();
	}
	mineBlock(){
		//while(Array(difficulty).join("0")!=this.hash.substr(0,difficulty)){
		//	this.nonce++;
			this.hash=this.calculateHash();			
		//}
	}
}
class BlockChain{//chain of blocks
	constructor(){
		this.chain=[this.createFirstBlock()];
		this.miningReward=100;
		this.pendingTransaction=[];
	}
	createFirstBlock(){
		return new Block("First Block","01/01/2018","0");
	}
	getLatestBlock () {
		return this.chain[this.chain.length-1];
	}
	//addBlock (newBlock) {
	//	newBlock.hashOfPreviousBlock=this.getLatestBlock().hash;
		//newBlock.hash=newBlock.calculateHash();
	//	newBlock.mineBlock();//returns hash
	//	this.chain.push(newBlock);
	//}
	minePendingTransactions(rewardAddr){//this method awards a mining reward in form of a cryptocurrency to a rewarding address(miner's address)
		var block=new Block(Date.now(),this.pendingTransaction);//create a block
		block.mineBlock();//mine the block
		this.chain.push(block);
		this.pendingTransaction=[
			new Transaction(null,rewardAddr,this.miningReward)
		];
	}
	createTransaction(transaction){
		this.pendingTransaction.push(transaction);
	}
	getBalance(address){//get balance of an address after a transaction. Balance is got through by going through all the transactions in the blocks of the blockchain
		var balance=0;
		for(const block of this.chain){
			for(const transaction of block.transactions){
				if (address===transaction.fromAddr) {//the transaction's sender's address
					balance-=transaction.amount;
				}else if (address===transaction.toAddr) {//the transaction's receiver's address
					balance+=transaction.amount;//the transaction's amount
				};
			}
		}
		return balance;
	}
	isValid(){//checking validity of the chain
		for (var i=1;i<this.chain.length; i++) {
			const currentBlock=this.chain[i];
			const prevBlock=this.chain[i-1];
			if (prevBlock.hash!=currentBlock.hashOfPreviousBlock) {
				return true;			
			}
				
		}
		return false;
	}

}


//testing code
let macoin=new BlockChain();//instance of the blockchain
//macoin.addBlock(new Block(1,{Amount:200},"10/07/2018"));
//macoin.addBlock(new Block(2,{Amount:190},"13/07/2018"));
//console.log(JSON.stringify(macoin,null,4));
//console.log(JSON.stringify(macoin.isValid()));
//macoin.chain[1].data={Amount:100};
//console.log(JSON.stringify(macoin,null,4));
//console.log(JSON.stringify(macoin.chain[1],null,4));

macoin.createTransaction(new Transaction("tomshyAddr","maltomAddr",100));//creating a transaction;will be stored in the pending transactions
macoin.createTransaction(new Transaction("maltomAddr","maltomAddr",50));

macoin.minePendingTransactions("mineraddress");

console.log("\n Balance of miner is "+macoin.getBalance("mineraddress"));
