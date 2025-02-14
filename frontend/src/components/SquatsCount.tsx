import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";

const SquatCounter: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(0);
  const [isSquatting, setIsSquatting] = useState(false);

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
          detectSquat(poses.landmarks[0]);
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

  const detectSquat = (landmarks: any) => {
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];

    if (!leftHip || !rightHip || !leftKnee || !rightKnee || !leftAnkle || !rightAnkle) return;

    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

    const squatThreshold = 100;
    const standThreshold = 160;

    if (leftKneeAngle < squatThreshold && rightKneeAngle < squatThreshold && !isSquatting) {
      setIsSquatting(true);
    } else if (leftKneeAngle > standThreshold && rightKneeAngle > standThreshold && isSquatting) {
      setIsSquatting(false);
      setCount((prev) => prev + 1);
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

  return (
    <div className="relative w-full max-w-2xl mx-auto text-center">
      <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
      <canvas ref={canvasRef} className="absolute top-0 left-0" />
      <h1 className="text-2xl font-bold mt-4">Squat Count: {count}</h1>
    </div>
  );
};

export default SquatCounter;
