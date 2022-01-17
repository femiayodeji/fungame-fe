import React, {useEffect, useState} from 'react';
import './SelectCharacter.css';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import FungameABI from '../../utils/FunGame.json';
import { ethers } from 'ethers';

const SelectCharacter = ({ setCharacterNFT }) => {
    const [characters, setCharacters] = useState([]);
    const [gameContract, setGameContract] = useState(null);

    const renderCharacters = () => {
        return characters.map((character, index) => (
            <div className="character-item" key={character.name}>
                <div className="name-container">
                    <p>{character.name}</p>
                </div>
                <img src={character.imageURI} alt={character.name} />
                <button
                    type="button"
                    className="character-mint-button"
                    // onClick={mintCharacterNFTAction(index)}
                >{`Mint ${character.name}`}</button>
            </div>
        ));        
    }

    useEffect(() => {
        const { ethereum } = window;
      
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const gameContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            FungameABI.abi,
            signer
          );
      
          setGameContract(gameContract);
        } else {
          console.log('Ethereum object not found');
        }
      }, []);
    
    useEffect(() => {
        const getCharacters = async () => {
          try {
            console.log('Getting contract characters to mint');
      
            const charactersTxn = await gameContract.getAllDefaultCharacters();
            console.log('charactersTxn:', charactersTxn);
      
            const characters = charactersTxn.map((characterData) =>
              transformCharacterData(characterData)
            );
      
            setCharacters(characters);
          } catch (error) {
            console.error('Something went wrong fetching characters:', error);
          }
        };
      
        if (gameContract) {
          getCharacters();
        }
      }, [gameContract]);

    return (
        <div className="select-character-container">
            <h2>Mint Your Hero. Choose wisely.</h2>
            {
                characters.length > 0 && 
                (
                    <div className="character-grid">{renderCharacters()}</div>
                )
            }
        </div>
    );
};

export default SelectCharacter;