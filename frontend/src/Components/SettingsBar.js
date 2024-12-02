import React, { useContext, useEffect, useState } from "react";
import TextLengthSelector from "./TextLengthSelector";
import {
  WpmContext,
  IsWordValidContext,
  IsTimerActive,
  ElapsedTimeContext,
  SetElapsedTimeContext,
  SetWpmContext,
} from "../App";
import { WordCountContext } from "./CommandCenter";
import axios from "axios";
import { UserUuidContext } from "../App";

function SettingsBar() {
  const isWordValid = useContext(IsWordValidContext);
  const isActive = useContext(IsTimerActive);
  const elapsedTime = useContext(ElapsedTimeContext);
  const setElapsedTime = useContext(SetElapsedTimeContext);
  const setWpm = useContext(SetWpmContext);
  const wordCount = useContext(WordCountContext);
  const wpm = useContext(WpmContext);

  const [acc, setAcc] = useState(null);

  const user_uuid = useContext(UserUuidContext);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 100);
      return () => clearInterval(interval);
    } else {
      if (elapsedTime !== null) {
        let correctWords = 0;
        let wordsChecked = 0;
        isWordValid.map((item) => {
          wordsChecked++;
          if (item === true) {
            correctWords++;
          }
        });
        if (elapsedTime > 0) {
          if (wordsChecked === wordCount) {
            handleGameEnd();
          } else {
            console.log("WChck ", wordsChecked);
          }
        } else {
          // setWpm(null)
        }
      }
      setElapsedTime(0);
    }
  }, [isActive]);

  const handleGameEnd = async () => {
    const correctWords = isWordValid.filter(Boolean).length; // Count of valid words
    const computedWpm = (correctWords / (elapsedTime / 10)) * 60; // WPM calculation
    const computedAcc = (correctWords / wordCount) * 100; // Accuracy calculation

    const userData = {
      user_uuid:user_uuid,
      wpm: computedWpm,
      time: elapsedTime,
    };


    setWpm(computedWpm);
    setAcc(computedAcc);

    try {
      console.log(userData);
      const response = await axios.post(
        "http://localhost:8080/post_game",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log("Error: ", error);
    }

    // e.preventDefault();
  };

  return (
    <div className="settings-bar">
      <TextLengthSelector />
      <div className="stats-display">
        WPM: {wpm !== null ? parseInt(wpm) : "XX"}/ ACC:{" "}
        {acc !== null ? acc : "XX"}
      </div>
    </div>
  );
}

export default SettingsBar;
