import { useSelector } from '@xstate/react';
import React, { useCallback, useState } from 'react';
import { useEditSegment, useSelect, useRaw, useSegmentApi } from '../../../ProjectContext';
import ActionButton from './ActionButton';
import { MenuItem, TextField, LinearProgress, Box } from '@mui/material';
import Grid from '@mui/material/Grid';

function LayerSelector({ layer, channelType }) {
  const segment = useEditSegment();
  const nuclearChannel = useSelector(segment, (state) => state.context.nuclearChannel);
  const wholeCellChannel = useSelector(segment, (state) => state.context.wholeCellChannel);

  const raw = useRaw();
  const names = useSelector(raw, (state) => state.context.channelNames);

  const onChangeNuclear = (e) => {
    segment.send({ type: 'SET_NUCLEAR_CHANNEL', nuclearChannel: Number(e.target.value) });
  };

  const onChangeWholeCell = (e) => {
    segment.send({ type: 'SET_WHOLE_CELL_CHANNEL', wholeCellChannel: Number(e.target.value) });
  };

  return channelType == 'nuclear' ? (
    <TextField
      select
      size='small'
      value={nuclearChannel}
      onChange={onChangeNuclear}
      sx={{ width: 130 }}
    >
      {names.map((opt, index) => (
        <MenuItem key={index} value={index}>
          {opt}
        </MenuItem>
      ))}
    </TextField>
  ) : (
    <TextField
      select
      size='small'
      value={wholeCellChannel}
      onChange={onChangeWholeCell}
      sx={{ width: 130 }}
    >
      {names.map((opt, index) => (
        <MenuItem key={index} value={index}>
          {opt}
        </MenuItem>
      ))}
    </TextField>
  );
}

function SegmentAllButton({ props, layer }) {
  const segment = useEditSegment();
  const segmentAPI = useSegmentApi();
  const segmentFinished = useSelector(segmentAPI, (state) => state.matches('idle'));
  const grayscale = useSelector(segment, (state) => state.matches('display.grayscale'));

  const segmentAction = useCallback(() => {
    setSegmentButtonClicked(true);
    segment.send('SEGMENTALL');
  }, [segment]);

  const [segmentButtonClicked, setSegmentButtonClicked] = useState(false);

  const tooltipText = (
    <span>
      Generate all the segmentation masks <kbd>M</kbd>
    </span>
  );

  return (
    <Grid>
      Select Nuclear Channel
      <Grid item xs={10.5}>
        <LayerSelector layer={layer} channelType={'nuclear'} />
      </Grid>
      Select Whole Cell Channel
      <Grid item xs={10.5}>
        <LayerSelector layer={layer} channelType={'wholeCell'} />
      </Grid>
      <Grid>
        <ActionButton
          {...props}
          // disabled={!grayscale}
          tooltipText={grayscale ? tooltipText : 'Run cell sam on one channel'}
          onClick={segmentAction}
          hotkey='m'
        >
          Segment All
        </ActionButton>
      </Grid>
      <Box sx={{ minWidth: 140, marginTop: 0.4 }}>
        {segmentButtonClicked && !segmentFinished && <LinearProgress />}
      </Box>
    </Grid>
  );
}

export default SegmentAllButton;
