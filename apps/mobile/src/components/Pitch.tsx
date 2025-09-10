import React, { useMemo, useRef, useState } from 'react';
import { View, PanResponder, PanResponderInstance } from 'react-native';
import Svg, { Rect, Circle, Line } from 'react-native-svg';
import { colors } from '../theme';

export type PlayerToken = {
  id: string;
  team: 'home' | 'away';
  x: number; // 0..1 normalized
  y: number; // 0..1 normalized
};

type Props = {
  width: number;
  height: number;
  players: PlayerToken[];
  onMove?: (id: string, x: number, y: number) => void;
};

export const Pitch: React.FC<Props> = ({ width, height, players, onMove }) => {
  const [dragId, setDragId] = useState<string | null>(null);
  const size = { w: width, h: height };
  const radius = 14;

  const responders = useRef<Record<string, PanResponderInstance>>({}).current;

  const ensureResponder = (id: string) => {
    if (responders[id]) return responders[id];
    responders[id] = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => setDragId(id),
      onPanResponderMove: (_, gesture) => {
        if (dragId !== id) return;
        const px = gesture.moveX - 16; // rough padding compensation
        const py = gesture.moveY - 100; // rough header compensation
        const nx = Math.max(0, Math.min(1, px / size.w));
        const ny = Math.max(0, Math.min(1, py / size.h));
        onMove?.(id, nx, ny);
      },
      onPanResponderRelease: () => setDragId(null),
    });
    return responders[id];
  };

  return (
    <View style={{ width, height, backgroundColor: colors.pitchGreen, borderRadius: 12, overflow: 'hidden' }}>
      <Svg width={width} height={height}>
        <Rect x={0} y={0} width={width} height={height} fill={colors.pitchGreen} />
        {/* Mid line */}
        <Line x1={width/2} y1={0} x2={width/2} y2={height} stroke={colors.pitchLine} strokeWidth={2} strokeDasharray="6 6" />
        {/* Border */}
        <Rect x={4} y={4} width={width-8} height={height-8} stroke={colors.pitchLine} strokeWidth={2} fill="none" />

        {players.map(p => {
          const cx = p.x * width;
          const cy = p.y * height;
          const color = p.team === 'home' ? colors.home : colors.away;
          const responder = ensureResponder(p.id);
          return (
            <Circle key={p.id} cx={cx} cy={cy} r={radius} fill={color} {...responder.panHandlers} />
          );
        })}
      </Svg>
    </View>
  );
};

