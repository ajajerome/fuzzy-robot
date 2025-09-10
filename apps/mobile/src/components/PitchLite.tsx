import React, { useRef } from 'react';
import { View, PanResponder, PanResponderInstance } from 'react-native';
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

export const PitchLite: React.FC<Props> = ({ width, height, players, onMove }) => {
  const responders = useRef<Record<string, PanResponderInstance>>({}).current;

  const makeResponder = (id: string) => {
    if (responders[id]) return responders[id];
    responders[id] = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        // Translate absolute gesture coordinates into normalized [0..1]
        // These offsets are approximate for header/safe area; good enough for MVP
        const px = Math.max(0, Math.min(width, gesture.moveX - 16));
        const py = Math.max(0, Math.min(height, gesture.moveY - 100));
        onMove?.(id, px / width, py / height);
      },
    });
    return responders[id];
  };

  return (
    <View style={{ width, height, backgroundColor: colors.pitchGreen, borderRadius: 12 }}>
      {/* Border */}
      <View style={{ position: 'absolute', left: 4, top: 4, right: 4, bottom: 4, borderColor: colors.pitchLine, borderWidth: 2, borderRadius: 10 }} />
      {/* Mid line */}
      <View style={{ position: 'absolute', left: '50%', top: 0, width: 2, height: '100%', backgroundColor: colors.pitchLine, opacity: 0.6 }} />

      {players.map((p) => {
        const left = Math.max(0, Math.min(width, p.x * width)) - 14;
        const top = Math.max(0, Math.min(height, p.y * height)) - 14;
        const bg = p.team === 'home' ? colors.home : colors.away;
        const r = makeResponder(p.id);
        return (
          <View
            key={p.id}
            {...r.panHandlers}
            style={{ position: 'absolute', left, top, width: 28, height: 28, borderRadius: 14, backgroundColor: bg, borderColor: '#0008', borderWidth: 1 }}
          />
        );
      })}
    </View>
  );
};

