import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

function Background() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: { color: "#02050d" },
        particles: {
          number: { value: 80 },
          color: { value: "#00ffcc" },
          links: {
            enable: true,
            color: "#00f7ff",
            distance: 120,
            opacity: 0.5
          },
          move: { enable: true, speed: 0.7 },
          size: { value: 2 },
          opacity: { value: 0.6 }
        }
      }}
    />
  );
}

export default Background;
