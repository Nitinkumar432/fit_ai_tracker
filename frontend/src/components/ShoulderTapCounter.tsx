import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";

const ShoulderTapCounter: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(0);
  const [leftTapState, setLeftTapState] = useState(false);
  const [rightTapState, setRightTapState] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    let landmarker: PoseLandmarker | null = null;

    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    const loadLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "/models/pose_landmarker_full.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      detectPose();
    };

    const detectPose = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const runPoseDetection = async () => {
        if (!videoRef.current || !landmarker) return;

        const video = videoRef.current;
        if (video.readyState < 2) {
          requestAnimationFrame(runPoseDetection);
          return;
        }

        const poses = landmarker.detectForVideo(video, performance.now());

        if (poses.landmarks.length > 0) {
          detectShoulderTap(poses.landmarks[0]);
          drawCanvas(ctx, video, poses.landmarks[0]);
        }

        requestAnimationFrame(runPoseDetection);
      };

      runPoseDetection();
    };

    setupCamera().then(loadLandmarker);

    return () => {
      landmarker?.close();
    };
  }, []);

  const detectShoulderTap = (landmarks: any) => {
    if (!isRunning) return; // Only detect taps if the timer is running

    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];

    if (!leftShoulder || !rightShoulder || !leftElbow || !rightElbow || !leftWrist || !rightWrist) return;

    const tapThreshold = 0.05;
    const angleThreshold = { min: 30, max: 90 };

    const calculateAngle = (A: any, B: any, C: any) => {
      const BAx = A.x - B.x;
      const BAy = A.y - B.y;
      const BCx = C.x - B.x;
      const BCy = C.y - B.y;

      const dotProduct = BAx * BCx + BAy * BCy;
      const magnitudeBA = Math.sqrt(BAx * BAx + BAy * BAy);
      const magnitudeBC = Math.sqrt(BCx * BCx + BCy * BCy);

      const angleRad = Math.acos(dotProduct / (magnitudeBA * magnitudeBC));
      return (angleRad * 180) / Math.PI;
    };

    const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);

    const rightHandTouchesLeftShoulder =
      Math.abs(rightWrist.x - leftShoulder.x) < tapThreshold &&
      Math.abs(rightWrist.y - leftShoulder.y) < tapThreshold &&
      rightArmAngle > angleThreshold.min &&
      rightArmAngle < angleThreshold.max;

    const leftHandTouchesRightShoulder =
      Math.abs(leftWrist.x - rightShoulder.x) < tapThreshold &&
      Math.abs(leftWrist.y - rightShoulder.y) < tapThreshold &&
      leftArmAngle > angleThreshold.min &&
      leftArmAngle < angleThreshold.max;

    if (rightHandTouchesLeftShoulder && !rightTapState) {
      setRightTapState(true);
      setCount((prev) => prev + 1);
      setTimeout(() => setRightTapState(false), 1000);
    }

    if (leftHandTouchesRightShoulder && !leftTapState) {
      setLeftTapState(true);
      setCount((prev) => prev + 1);
      setTimeout(() => setLeftTapState(false), 1000);
    }
  };

  const drawCanvas = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement, landmarks: any) => {
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    ctx.drawImage(video, 0, 0, canvasRef.current!.width, canvasRef.current!.height);

    const drawingUtils = new DrawingUtils(ctx);
    landmarks.forEach((landmark: any) => {
      drawingUtils.drawLandmarks([landmark], { color: "blue", radius: 5 });
    });
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetAll = () => {
    setCount(0);
    setIsRunning(false);
    setLeftTapState(false);
    setRightTapState(false);
  };

  const saveData = () => {
    const data = { shoulderTaps: count };
    console.log("Saved Data:", data);
    alert("Data saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-800 mb-8">Shoulder Tap Challenge</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" width={640} height={480} />
          </div>
          <div className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col justify-between">
            <div>
              <motion.h2
                className="text-4xl font-extrabold text-blue-600 mb-4"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Shoulder Taps: {count}
              </motion.h2>
              <motion.p
                className="text-3xl text-purple-600 mb-8"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {leftTapState ? "Left Tap Active" : rightTapState ? "Right Tap Active" : "Tap Inactive"}
              </motion.p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <motion.button
                onClick={isRunning ? stopTimer : startTimer}
                className={`py-3 rounded-xl text-lg font-semibold shadow-lg ${
                  isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                } text-white transition-colors duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isRunning ? "Stop" : "Start"}
              </motion.button>
              <motion.button
                onClick={resetAll}
                className="py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl text-lg font-semibold shadow-lg text-white transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset
              </motion.button>
              <motion.button
                onClick={saveData}
                className="py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-lg font-semibold shadow-lg text-white transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save
              </motion.button>
              <motion.button
                onClick={() => setShowTutorial(!showTutorial)}
                className="py-3 bg-purple-500 hover:bg-purple-600 rounded-xl text-lg font-semibold shadow-lg text-white transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showTutorial ? "Hide" : "Show"} Tutorial
              </motion.button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              className="mt-8 bg-white rounded-2xl shadow-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-blue-800 mb-4">How to Perform Shoulder Taps</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Start in a plank position with your hands directly under your shoulders.</li>
                <li>Keep your body in a straight line from head to heels.</li>
                <li>Lift one hand off the ground and tap the opposite shoulder.</li>
                <li>Return your hand to the starting position and repeat with the other hand.</li>
                <li>Alternate sides while maintaining a stable core.</li>
              </ol>
              <p className="mt-4 text-gray-600">
                Remember to keep your hips stable and avoid rocking side to side.
              </p>
              <div className="mt-6 flex justify-center">
                <img
                  src="https://i.pinimg.com/originals/bc/cc/b3/bcccb362fd9c0f100079d6a0fc3926ec.gif"
                  alt="Shoulder Tap tutorial"
                  className="w-full max-w-md rounded-xl shadow-md"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ShoulderTapCounter;