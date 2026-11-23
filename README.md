# Power System Coherency Lab — Version 3

Standalone React + Vite project. V3 adds dynamic sliding-window coherency clustering, generator-group evolution heatmap, adjustable observation window, replay time, and historical rotor/network inspection to V2.

## Run

```bash
npm install
npm run dev
```

## Deploy

Upload the contents of this folder (not the folder itself) to a new GitHub repository `power-system-coherency-lab-v3`. Import that repository in Vercel. Use Vite preset, build `npm run build`, output `dist`.

## Experiments

1. Click **Disturb G1**. Wait at least 8 seconds.
2. In **Automatic coherency identification**, select **Windowed angle-distance**.
3. Explore **Dynamic coherency evolution**. Change the window length and click the map to replay the network state.
4. Compare weak and strong area coupling.

## Scientific limitations

Educational normalized nonlinear classical swing model. Sliding-window grouping is agglomerative clustering on RMS rotor-angle differences; the requested number of groups is imposed. Timeline colors are matched to previous windows by maximum overlap, which is a display convention, not proof of persistent physical coherency. No validated power flow, generator controllers, state estimation, or exact full-system eigenanalysis.
