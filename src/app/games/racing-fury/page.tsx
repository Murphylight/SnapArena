'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import Link from 'next/link';

// Types
interface Player {
  id: string;
  name: string;
  avatar: string;
  betAmount: number;
}

interface GameState {
  status: 'waiting' | 'starting' | 'playing' | 'finished';
  players: Player[];
  countdown: number;
  winner: string | null;
}

// Animations
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function RacingFuryGame() {
  const { t } = useTranslation();
  const { currency } = useUserPreferences();
  const [betAmount, setBetAmount] = useState<number>(5);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [gameState, setGameState] = useState<GameState>({
    status: 'waiting',
    players: [
      { id: 'player1', name: 'MaxSpeed99', avatar: '/images/avatars/avatar1.jpg', betAmount: 10 },
      { id: 'player2', name: 'RacerX', avatar: '/images/avatars/avatar2.jpg', betAmount: 15 },
    ],
    countdown: 0,
    winner: null,
  });
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Format de la devise
  const formatCurrency = (amount: number) => {
    return `${amount} ${currency.symbol}`;
  };

  // Calculer le pot total
  const totalPot = gameState.players.reduce((total, player) => total + player.betAmount, 0) + (isJoining ? betAmount : 0);

  // Gérer le changement de montant du pari
  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setBetAmount(value);
  };

  // Gérer le clic sur le bouton "Rejoindre la partie"
  const handleJoinGame = () => {
    if (betAmount < 5) {
      setErrorMessage(t('games.errors.minimumBet', { amount: formatCurrency(5) }));
      return;
    }

    setIsJoining(true);
    setErrorMessage('');

    // Simulation: Ajouter le joueur après un délai
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        players: [
          ...prev.players,
          { 
            id: 'current-user', 
            name: 'You', 
            avatar: '/images/avatars/user.jpg', 
            betAmount: betAmount 
          }
        ]
      }));

      // Démarrer le compte à rebours si nous avons assez de joueurs
      if (gameState.players.length >= 2) {
        startCountdown();
      }
    }, 1000);
  };

  // Démarrer le compte à rebours
  const startCountdown = () => {
    setGameState(prev => ({
      ...prev,
      status: 'starting',
      countdown: 10
    }));

    // Réduire le compte à rebours chaque seconde
    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.countdown <= 1) {
          clearInterval(interval);
          // Démarrer la partie
          startGame();
          return { ...prev, countdown: 0 };
        }
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);
  };

  // Démarrer la partie
  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      status: 'playing'
    }));

    // Simuler une partie qui dure 30 secondes
    setTimeout(() => {
      finishGame();
    }, 30000);
  };

  // Terminer la partie
  const finishGame = () => {
    // Sélectionner un gagnant au hasard (pour la démo)
    const winnerIndex = Math.floor(Math.random() * gameState.players.length);
    const winner = gameState.players[winnerIndex];

    setGameState(prev => ({
      ...prev,
      status: 'finished',
      winner: winner.id,
    }));
  };

  // Effet pour initialiser le jeu WebGL
  useEffect(() => {
    const currentContainer = gameContainerRef.current;
    if (currentContainer) {
      // Ici, vous intégrez le jeu WebGL Unity
      // Dans une implémentation réelle, vous pourriez charger le jeu Unity
      // comme dans l'exemple ci-dessous:
      /*
      const unityInstance = UnityLoader.instantiate(
        currentContainer,
        "/unity/racing-fury/Build/racing-fury.json",
        { onProgress: (progress) => console.log(progress) }
      );
      */

      // Pour la démo, nous utilisons une animation simple
      const canvas = document.createElement('canvas');
      canvas.width = currentContainer.clientWidth;
      canvas.height = currentContainer.clientHeight;
      currentContainer.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        const cars = gameState.players.map((player, index) => ({
          x: 50,
          y: 50 + index * 60,
          speed: 1 + Math.random() * 3,
          color: ['red', 'blue', 'green', 'yellow'][index % 4],
          player: player
        }));

        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Dessiner la ligne d'arrivée
          ctx.beginPath();
          ctx.moveTo(canvas.width - 50, 0);
          ctx.lineTo(canvas.width - 50, canvas.height);
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 5;
          ctx.stroke();
          
          // Dessiner et déplacer les voitures
          cars.forEach((car) => {
            ctx.fillStyle = car.color;
            ctx.fillRect(car.x, car.y, 40, 20);
            car.x += car.speed;
            
            // Afficher le nom du joueur
            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            ctx.fillText(car.player.name, car.x, car.y - 5);
          });
          
          if (gameState.status === 'playing') {
            requestAnimationFrame(animate);
          }
        };
        
        animate();
      }
    }

    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = '';
      }
    };
  }, [gameState.status, gameState.players]);

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/games" className="text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('games.backToGames')}
          </Link>
        </div>

        <motion.div
          className="text-center mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Racing Fury
          </h1>
          <p className="mt-2 text-xl text-gray-600 dark:text-gray-300">
            {t('games.racingFury.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Jeu WebGL */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div 
                ref={gameContainerRef} 
                className="w-full bg-black aspect-w-16 aspect-h-9 min-h-[300px] lg:min-h-[500px] flex items-center justify-center"
              >
                {gameState.status === 'waiting' && (
                  <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">{t('games.waitingForPlayers')}</h2>
                    <p>{t('games.minimumPlayersRequired', { count: 3 })}</p>
                    <p className="mt-4">{t('games.currentPlayers', { count: gameState.players.length })}</p>
                  </div>
                )}

                {gameState.status === 'starting' && (
                  <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">{t('games.startingIn')}</h2>
                    <div className="text-6xl font-bold">{gameState.countdown}</div>
                  </div>
                )}

                {gameState.status === 'finished' && (
                  <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">{t('games.gameFinished')}</h2>
                    <p>{t('games.winnerIs', { name: gameState.players.find(p => p.id === gameState.winner)?.name })}</p>
                    <button 
                      className="mt-8 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium"
                      onClick={() => window.location.reload()}
                    >
                      {t('games.playAgain')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panneau de paris */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('games.bettingPanel')}
                </h2>

                <div className="mb-6">
                  <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('games.totalPot')}
                  </div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {formatCurrency(totalPot)}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 py-4">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {t('games.players')} ({gameState.players.length})
                  </h3>
                  <div className="space-y-3">
                    {gameState.players.map(player => (
                      <div key={player.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                            {/* Placeholder for avatar */}
                          </div>
                          <span className="ml-2 text-gray-900 dark:text-white">{player.name}</span>
                        </div>
                        <span className="font-medium text-amber-600 dark:text-amber-400">
                          {formatCurrency(player.betAmount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {!isJoining && gameState.status === 'waiting' && (
                  <div className="mt-6">
                    <label htmlFor="betAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('games.yourBet')}
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        id="betAmount"
                        min="5"
                        max="100"
                        step="5"
                        value={betAmount}
                        onChange={handleBetAmountChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <span className="text-gray-900 dark:text-white font-medium min-w-[80px] text-right">
                        {formatCurrency(betAmount)}
                      </span>
                    </div>

                    {errorMessage && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errorMessage}
                      </p>
                    )}

                    <button
                      onClick={handleJoinGame}
                      className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md font-medium"
                    >
                      {t('games.joinGame')}
                    </button>
                  </div>
                )}

                {isJoining && (
                  <div className="mt-6">
                    <div className="text-center text-gray-700 dark:text-gray-300">
                      {t('games.yourBet')}: <span className="font-medium text-amber-600 dark:text-amber-400">{formatCurrency(betAmount)}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                      {t('games.waitingForOtherPlayers')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 