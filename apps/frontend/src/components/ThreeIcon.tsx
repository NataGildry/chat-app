import * as THREE from 'three';
import { useSelector } from 'react-redux';
import { useEffect, useRef} from 'react';
import type {RootState} from '../ store';


export const ThreeIcon = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const messageCount = useSelector((state: RootState) => state.chat.messages.length);
  const prevCountRef = useRef<number>(messageCount);

  useEffect(() => {
    const width = 300;
    const height = 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    if (mountRef.current) {
      // Clean up any existing canvas before appending a new one
      while (mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
      mountRef.current.appendChild(renderer.domElement);
    }

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 2).normalize();
    scene.add(light);

    meshRef.current = cube;
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    // Initial render
    renderer.render(scene, camera);

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Trigger animation on message count increase
  useEffect(() => {
    const prev = prevCountRef.current;
    if (messageCount > prev && meshRef.current && rendererRef.current && sceneRef.current && cameraRef.current) {
      const cube = meshRef.current;
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;

      let frame = 0;
      const maxFrames = 20;

      const animate = () => {
        if (frame < maxFrames) {
          cube.rotation.x += 0.1;
          cube.rotation.y += 0.1;
          renderer.render(scene, camera);
          frame++;
          requestAnimationFrame(animate);
        } else {
          cube.rotation.x = 0;
          cube.rotation.y = 0;
          renderer.render(scene, camera);
        }
      };

      // Optional bounce effect
      cube.scale.set(1.2, 1.2, 1.2);
      setTimeout(() => cube.scale.set(1, 1, 1), 150);

      animate();
    }

    prevCountRef.current = messageCount;
  }, [messageCount]);

  return <div ref={mountRef} className="mx-auto" />;
};
