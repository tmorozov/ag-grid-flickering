import React, {useCallback, useEffect, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { indexedData, columnDefs } from './data';
import {LicenseManager} from 'ag-grid-enterprise';
import {key} from './ag-grid-key';
LicenseManager.setLicenseKey(key);

function App() {
  const [clicks, setClicks] = useState(0);

  const trigger = useCallback(() => {
    setClicks(clicks + 1);
    console.log('on click', clicks);
  }, [clicks])
  
  // const trigger = () => {
  //   setClicks(clicks + 1);
  //   console.log('on click', clicks);
  // }

  useEffect(() => {
    console.log('init effect', clicks);
    return () => {
      console.log('cleanup effect', clicks)
    }
  }, [clicks])

  return (
    <div>
      {clicks}
      <button onClick={trigger}>click</button>
      <Grid></Grid>
    </div>
  )
}

let viewportParams;
let viewport = {
  init: params => {
    // console.log('init', params);
    try {
      viewportParams = params;
      // console.log('setViewportParams', viewportParams)
    } catch (e) {
      console.error(e);
    }
  },
  setViewportRange: async (firstRow, lastRow) => {
      let windowSize = lastRow - firstRow + 1;
      if (windowSize <= 0) {
        windowSize = 1;
      }
      // this.tableClient!.bounds = {firstRow, windowSize};
  }
};

function Grid() {
  let [rowsCount, setRowCount] = useState(0);

  useEffect(() => {
    // console.log('useEffect')
    setInterval(() => {
      const rc = 10000 + Math.round(Math.random()*1000);
      setRowCount(rc);
      if (viewportParams) {
        viewportParams.setRowData(indexedData())
        Promise.resolve().then(() => viewportParams.setRowCount(rc))
      }    
    }, 10)
  }, [])

  const onGridReady = useCallback((params) => {
    console.log('onGridReady')
    // startEmulation();
  }, []);

  return (
    <>
    <div className="ag-theme-balham" style={{ height: '500px', width: '600px'}}>
      <AgGridReact
          rowModelType="viewport"
          suppressChangeDetection={true}
          suppressColumnVirtualisation={true}
          suppressScrollOnNewData={true}
          viewportDatasource={viewport}
          viewportRowModelBufferSize={20}
          viewportRowModelPageSize={20}
					columnDefs={columnDefs}
          onGridReady={onGridReady}
          >
			</AgGridReact>
    </div>
    <div>{rowsCount}</div>
    </>
  );
}

export default App;
