import React, {useEffect, useState} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import mkLogo from './assets/mk.png';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import FungameABI from './utils/FunGame.json';
import { ethers } from 'ethers';

const TWITTER_HANDLE = 'thefemiayodeji';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [characterNFT, setCharacterNFT] = useState(null);

    const checkIfWalletIsConnected = async () => {
      try {
        const { ethereum } = window;
  
        if (!ethereum) {
          console.log('Make sure you have MetaMask!');
          return;
        } else {
          console.log('We have the ethereum object', ethereum);
  
          const accounts = await ethereum.request({ method: 'eth_accounts' });
  
          if (accounts.length !== 0) {
            const account = accounts[0];
            console.log('Found an authorized account:', account);
            setCurrentAccount(account);
          } else {
            console.log('No authorized account found');
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    
    const renderContent = () => {
      if (!currentAccount) {
        return (
          <div className="connect-wallet-container">
            <button
              className="cta-button connect-wallet-button"
              onClick={connectWalletAction}
            >
              Connect Wallet To Get Started
            </button>  
          </div>
        );
      } else if (currentAccount && !characterNFT) {
        return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
      }
    };

    const connectWalletAction = async () => {
      try {
        const { ethereum } = window;
  
        if (!ethereum) {
          alert('Get MetaMask!');
          return;
        }
  
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });
  
        console.log('Connected', accounts[0]);
        setCurrentAccount(accounts[0]);
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      checkIfWalletIsConnected();

      // const checkNetwork = async () => {
      //   try { 
      //     alert(window.ethereum.networkVersion);
      //     if (window.ethereum.networkVersion !== '4') {
      //       alert("Please connect to Rinkeby!")
      //     }
      //   } catch(error) {
      //     console.log(error)
      //   }
      // };

    }, []);

    useEffect(() => {
      const fetchNFTMetadata = async () => {
        console.log('Checking for Character NFT on address:', currentAccount);
    
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const gameContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          FungameABI.abi,
          signer
        );
    
        const txn = await gameContract.checkIfUserHasNFT();
        if (txn.name) {
          console.log('User has character NFT');
          setCharacterNFT(transformCharacterData(txn));
        } else {
          console.log('No character NFT found');
        }
      };
    
      if (currentAccount) {
        console.log('CurrentAccount:', currentAccount);
        fetchNFTMetadata();
      }
    }, [currentAccount]);
          
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">
            Meta 
            <img className="mk-logo" src={mkLogo} alt='MK Logo'/>
            Kombat
          </p>
          <p className="sub-text">Team up to protect the Metaverse!</p>

          {renderContent()}

        </div>
        <div className="footer-container">
          <span className="footer-text">Built by </span>
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE}`}</a>
          <span  className="footer-text">All Rights Licensed</span>
        </div>
      </div>
    </div>
  );
};

export default App;
