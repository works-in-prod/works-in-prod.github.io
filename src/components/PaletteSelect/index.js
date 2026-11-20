import React, {useEffect, useState} from 'react';
import palettes from '@site/src/theme/palettes.json';
import settings from '@site/src/theme/palette-settings.json';

export default function PaletteSelect({onChange}) {
  const [paletteId, setPaletteId] = useState(settings.defaultPalette);

  useEffect(() => {
    const selected = document.documentElement.dataset.palette;
    if (!Object.hasOwn(palettes, selected)) {
      return;
    }
    setPaletteId(selected);
    onChange(palettes[selected].scheme);
  }, [onChange]);

  function selectPalette(event) {
    const nextPaletteId = event.target.value;
    if (!Object.hasOwn(palettes, nextPaletteId)) {
      return;
    }

    document.documentElement.dataset.palette = nextPaletteId;
    setPaletteId(nextPaletteId);
    onChange(palettes[nextPaletteId].scheme);

    try {
      localStorage.setItem(settings.storageKey, nextPaletteId);
    } catch {
      // The current selection still works when browser storage is unavailable.
    }
  }

  return (
    <label className="theme-picker">
      <span>Theme</span>
      <select value={paletteId} onChange={selectPalette}>
        {Object.entries(palettes).map(([id, palette]) => (
          <option key={id} value={id}>{palette.name}</option>
        ))}
      </select>
    </label>
  );
}
