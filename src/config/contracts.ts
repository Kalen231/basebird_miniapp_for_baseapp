export const DAILY_STREAK_ADDRESS = "0x0000000000000000000000000000000000000000"; // TODO: Deploy contracts/DailyStreak.sol and update this!

export const DAILY_STREAK_ABI = [
    {
        "inputs": [],
        "name": "mintDaily",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "streakCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "lastMintTime",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "hasEarlyBird",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getStreakStatus",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "currentStreak",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "lastMint",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isCompleted",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "canMint",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const;
