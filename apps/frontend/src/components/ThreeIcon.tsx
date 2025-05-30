import * as THREE from 'three';
import { useSelector } from 'react-redux';
import { useEffect, useRef} from 'react';
import type { RootState } from '../ store';

export const ThreeIcon = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const meshRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const messageCount = useSelector((state: RootState) => state.chat.messages.length);
  const prevCountRef = useRef<number>(messageCount);

  useEffect(() => {
    const width = 100;
    const height = 100;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(width, height);

    if (mountRef.current) {
      while (mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
      mountRef.current.appendChild(renderer.domElement);
    }

    // Chat bubble
    const main = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 32, 32),
      new THREE.MeshStandardMaterial({color: 0xa3d5ff})
    );

    const left = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 32),
      new THREE.MeshStandardMaterial({color: 0xa3d5ff})
    );
    left.position.set(-0.4, 0.1, 0);

    const right = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 32, 32),
      new THREE.MeshStandardMaterial({color: 0xa3d5ff})
    );
    right.position.set(0.4, 0.05, 0);

    const tail = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 32, 32),
      new THREE.MeshStandardMaterial({color: 0xa3d5ff})
    );
    tail.position.set(0, -0.5, 0);

    const group = new THREE.Group();
    group.add(main);
    group.add(left);
    group.add(right);
    group.add(tail);


    scene.add(group);

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 2).normalize();
    scene.add(light);

    meshRef.current = group;
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    renderer.render(scene, camera);

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const prev = prevCountRef.current;
    if (
      messageCount > prev &&
      meshRef.current &&
      rendererRef.current &&
      sceneRef.current &&
      cameraRef.current
    ) {
      const group = meshRef.current;
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;

      let frame = 0;
      const maxFrames = 30;

      const animate = () => {
        if (frame < maxFrames) {
          group.rotation.y += 0.1;
          group.scale.setScalar(1.0 + 0.1 * Math.sin((frame / maxFrames) * Math.PI));
          renderer.render(scene, camera);
          frame++;
          requestAnimationFrame(animate);
        } else {
          group.rotation.y = 0;
          group.scale.set(1, 1, 1);
          renderer.render(scene, camera);
        }
      };

      animate();
    }

    prevCountRef.current = messageCount;
  }, [messageCount]);

  return <div ref={mountRef}/>;
};
