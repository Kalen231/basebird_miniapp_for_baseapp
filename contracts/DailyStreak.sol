// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title DailyStreak
 * @dev Manages daily streaks for Base Bird game.
 * Logic:
 * - Users can mint 1 "Energy" per day.
 * - If they do this for 7 days in a row, they get the "Early Bird" achievement.
 * - If they miss a day (more than 48 hours since last mint), streak resets to 1.
 * - Fully on-chain state.
 */
contract DailyStreak {
    // State
    mapping(address => uint256) public streakCount;
    mapping(address => uint256) public lastMintTime;
    mapping(address => bool) public hasEarlyBird;

    // Events
    event EnergyMinted(address indexed user, uint256 day, uint256 timestamp);
    event StreakReset(address indexed user, uint256 timestamp);
    event EarlyBirdEarned(address indexed user, uint256 timestamp);

    // Constants
    uint256 public constant STREAK_GOAL = 7;
    uint256 public constant ONE_DAY = 1 days; // 24 hours
    uint256 public constant TWO_DAYS = 2 days; // 48 hours

    /**
     * @dev Mint daily energy. msg.sender pays gas.
     */
    function mintDaily() external {
        uint256 lastTime = lastMintTime[msg.sender];
        uint256 currentTime = block.timestamp;

        // First time minting
        if (lastTime == 0) {
            streakCount[msg.sender] = 1;
        } else {
            uint256 diff = currentTime - lastTime;

            require(diff >= ONE_DAY, "DailyStreak: Cooldown not finished (wait 24h)");

            if (diff > TWO_DAYS) {
                // Streak broken
                streakCount[msg.sender] = 1;
                emit StreakReset(msg.sender, currentTime);
            } else {
                // Connection streak
                streakCount[msg.sender] += 1;
            }
        }

        // Update time
        lastMintTime[msg.sender] = currentTime;
        
        uint256 currentStreak = streakCount[msg.sender];
        emit EnergyMinted(msg.sender, currentStreak, currentTime);

        // Check for achievement
        if (currentStreak >= STREAK_GOAL && !hasEarlyBird[msg.sender]) {
            hasEarlyBird[msg.sender] = true;
            emit EarlyBirdEarned(msg.sender, currentTime);
        }
    }

    /**
     * @dev Get user streak status
     * @return currentStreak Current streak count
     * @return lastMint Last mint timestamp
     * @return isCompleted Whether Early Bird is unlocked
     * @return canMint Whether user can mint now
     */
    function getStreakStatus(address user) external view returns (
        uint256 currentStreak,
        uint256 lastMint,
        bool isCompleted,
        bool canMint
    ) {
        currentStreak = streakCount[user];
        lastMint = lastMintTime[user];
        isCompleted = hasEarlyBird[user];
        
        bool cooldownFinished = (block.timestamp >= lastMint + ONE_DAY);
        // Special case: if never minted, can mint
        if (lastMint == 0) cooldownFinished = true;
        
        canMint = cooldownFinished;
        
        // Logical adjustment for view: if time > 2 days, streak technically is broken (will reset on next mint)
        // But we return the stored value. Frontend should show "Streak Broken" if time > 2 days.
    }
}
