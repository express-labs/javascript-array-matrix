/* eslint-disable quotes */
/* eslint-disable no-confusing-arrow */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-did-mount-set-state */
import React from 'react';
import ReactJson from 'react-json-view';
import {
  colorSizes,
  missingExtensions,
  sizeExtensions,
  sizeExtensionsNullSet,
  waistInseam,
} from './examples';
import {
  mutate,
  sizeExtensionMutation,
  sizeNameMutation,
  waistInseamMutation,
} from './mutate';
import ArrayMatrix from '../ArrayMatrix';
import s from './style.css';

class DevelopmentApp extends React.Component {
  static getQueryTable(tensor, headers, query, method = 'getDimension') {
    let queryTime;
    const scalars = (() => {
      const start = performance.now();
      const resultSet = tensor[method](query);
      const end = performance.now();
      queryTime = end - start;
      return resultSet instanceof Array ? resultSet : [resultSet];
    })();

    return (
      <div>
        <p>
          Query executed in {queryTime} milliseconds.
        </p>
        <table>
          <tbody>
            <tr>
              <th />
              {headers.map(header => <th key={`header-${header}`}>{header}</th>)}
            </tr>
            {scalars.map((scalar, idx) => (
              <tr key={`tr-${idx}`}>
                <td>{idx + 1}</td>
                {headers.map((header, tdidx) => scalar ? <td key={`td-${idx}-${tdidx}`}>{scalar[header]}</td> : <td key={`td-${idx}-${tdidx}`}>{'null'}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  constructor() {
    super();
    this.state = {
      colorSizesData: null,
      sizeExtensionsData: null,
      waistInseamData: null,
      value: '0',
      perf: {},
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState(() => {
      const tensors = {};
      const perf = {};

      const configs = {
        colorSizesData: {
          data: mutate(colorSizes, [sizeNameMutation]),
          orders: ['colorName', 'size'],
        },
        missingExtensionsData: {
          data: missingExtensions,
          orders: ['colorName', 'ext', 'size', 'inseam'],
        },
        sizeExtensionsData: {
          data: mutate(sizeExtensions, [sizeExtensionMutation, sizeNameMutation]),
          orders: ['colorName', 'extension', 'size'],
        },
        sizeExtensionsNullSetData: {
          data: mutate(sizeExtensionsNullSet, [sizeExtensionMutation, sizeNameMutation]),
          orders: ['colorName', 'extension', 'size'],
        },
        waistInseamData: {
          data: mutate(waistInseam, [waistInseamMutation]),
          orders: ['colorName', 'waist', 'inseam'],
        },
        waistSizeExtensionsData: {
          data: mutate(waistInseam, [sizeExtensionMutation, sizeNameMutation, waistInseamMutation]),
          orders: ['colorName', 'extension', 'waist', 'inseam'],
        },
        waistSizeExtensionsColorData: {
          data: mutate(waistInseam, [sizeExtensionMutation, sizeNameMutation, waistInseamMutation]),
          orders: ['waist', 'inseam', 'extension', 'colorName'],
        },
      };

      Object.keys(configs).forEach((key) => {
        const start = performance.now();
        tensors[key] = new ArrayMatrix(configs[key]);
        const end = performance.now();
        perf[key] = (end - start);
      });

      return Object.assign({}, tensors, { perf });
    }, () => {
      window.colorSizeMatrix = this.state.colorSizesData;
      window.missingExtensions = this.state.missingExtensionsData;
      window.sizeExtensionsMatrix = this.state.sizeExtensionsData;
      window.sizeExtensionsNullSetMatrix = this.state.sizeExtensionsNullSetData;
      window.waistInseamMatrix = this.state.waistInseamData;
      window.waistSizeExtensionsMatrix = this.state.waistSizeExtensionsData;
    });
  }

  handleChange(ev) {
    this.setState({
      value: ev.target.value,
    });
  }

  render() {
    const {
      colorSizesData,
      sizeExtensionsData,
      sizeExtensionsNullSetData,
      waistInseamData,
      waistSizeExtensionsData,
      waistSizeExtensionsColorData,
      missingExtensionsData,
    } = this.state;

    return (
      <div>
        <h1>JavaScript Array Matrix</h1>
        <select className={s.select} value={this.state.value} onChange={this.handleChange}>
          <option value="0">Color and Sizes</option>
          <option value="1">Color, Size Extensions, and Sizes</option>
          <option value="2">Color, Waist, and Inseam</option>
          <option value="3">Color, Size Extensions, Waist, and Inseam</option>
          <option value="4">Waist, Inseam, Size Extensions, and Color</option>
          <option value="5">Missing Extensions</option>
          <option value="6">Color, Size Extensions, and Sizes (Null set)</option>
        </select>
        <hr />
        { (this.state.value === '0') && (
          <section id="example--0">
            <h2>2 Order Matrix: Color and Sizes</h2>
            {colorSizesData && <div>
              <h3>Matrix Data</h3>
              <ReactJson
                src={colorSizesData.debug()}
                theme="monokai"
                iconStyle="triangle"
                collapsed={1}
                name="colorSizes"
                enableClipboard={false}
              />
              <pre>{`Data parsed in ${this.state.perf.colorSizesData} milliseconds.`}</pre>
              <h3>Dimension Queries</h3>
              <h4>Query by colorName</h4>
              <pre>{`{ colorName: 'MILITARY' }`}</pre>
              {DevelopmentApp.getQueryTable(colorSizesData, ['skuId', 'colorName', 'size'], { colorName: 'MILITARY' })}
              <hr />
              <h4>Query by size</h4>
              <pre>{`{ size: 'S' }`}</pre>
              {DevelopmentApp.getQueryTable(colorSizesData, ['skuId', 'colorName', 'size'], { size: 'S' })}
              <hr />
              <h4>Query by size</h4>
              <pre>{`{ size: 'XXL' }`}</pre>
              {DevelopmentApp.getQueryTable(colorSizesData, ['skuId', 'colorName', 'size'], { size: 'XXL' })}
              <hr />
              <h3>Entry Queries</h3>
              <pre>{`{ size: 'S', colorName: 'DUSTY MOSS' }`}</pre>
              {DevelopmentApp.getQueryTable(colorSizesData, ['skuId', 'colorName', 'size'], { size: 'S', colorName: 'DUSTY MOSS' }, 'getEntry')}
              <hr />
              <pre>{`{ size: 'XXL', colorName: 'COBALT BLUE' }`}</pre>
              {DevelopmentApp.getQueryTable(colorSizesData, ['skuId', 'colorName', 'size'], { size: 'XXL', colorName: 'COBALT BLUE' }, 'getEntry')}
            </div>}
          </section>
        )}

        { (this.state.value === '1') && (
          <section id="example--1">
            <h2>3 Order Matrix: Color, Size Extensions, and Sizes</h2>
            {sizeExtensionsData && <div>
              <h3>Matrix Data</h3>
              <ReactJson
                src={sizeExtensionsData.debug()}
                theme="monokai"
                iconStyle="triangle"
                collapsed={1}
                name="sizeExtensions"
                enableClipboard={false}
              />
              <pre>{`Data parsed in ${this.state.perf.sizeExtensionsData} milliseconds.`}</pre>
              <h3>Dimension Queries</h3>
              <h4>Query by colorName and extension</h4>
              <pre>{`{ colorName: 'NAVY', extension: 'Regular' }`}</pre>
              {DevelopmentApp.getQueryTable(sizeExtensionsData, ['skuId', 'colorName', 'extension', 'size'], { colorName: 'NAVY', extension: 'Regular' })}
              <hr />
              <h4>Query by colorName and extension</h4>
              <pre>{`{ colorName: 'RUBY RED', extension: 'Tall' }`}</pre>
              {DevelopmentApp.getQueryTable(sizeExtensionsData, ['skuId', 'colorName', 'extension', 'size'], { colorName: 'RUBY RED', extension: 'Tall' })}
              <hr />
              <h4>Query by colorName and size</h4>
              <pre>{`{ colorName: 'BLACK', size: 'S' }`}</pre>
              {DevelopmentApp.getQueryTable(sizeExtensionsData, ['skuId', 'colorName', 'extension', 'size'], { colorName: 'BLACK', size: 'S' })}
              <hr />
              <h4>Query by colorName and size</h4>
              <pre>{`{ colorName: 'WHITE', size: 'M' }`}</pre>
              {DevelopmentApp.getQueryTable(sizeExtensionsData, ['skuId', 'colorName', 'extension', 'size'], { colorName: 'WHITE', size: 'M' })}
              <hr />
              <h4>Query by extension and size</h4>
              <pre>{`{ extension: 'Regular', size: 'M' }`}</pre>
              {DevelopmentApp.getQueryTable(sizeExtensionsData, ['skuId', 'colorName', 'extension', 'size'], { extension: 'Regular', size: 'M' })}
              <hr />
              <h3>Entry Queries</h3>
              <pre>{`{ size: 'S', colorName: 'NAVY', extension: 'Regular' }`}</pre>
              {DevelopmentApp.getQueryTable(sizeExtensionsData, ['skuId', 'colorName', 'size'], { size: 'S', colorName: 'NAVY', extension: 'Regular' }, 'getEntry')}
              <hr />
              <pre>{`{ size: 'S', colorName: 'BLACK', extension: 'Tall' }`}</pre>
              {DevelopmentApp.getQueryTable(sizeExtensionsData, ['skuId', 'colorName', 'size'], { size: 'S', colorName: 'BLACK', extension: 'Tall' }, 'getEntry')}
            </div>}
          </section>
        )}

        { (this.state.value === '2') && (
          <section id="example--2">
            <h2>3 Order Matrix: Color, Waist, and Inseam</h2>
            {waistInseamData && <div>
              <h3>Matrix Data</h3>
              <ReactJson
                src={waistInseamData.debug()}
                theme="monokai"
                iconStyle="triangle"
                name="waistInseam"
                collapsed={1}
                enableClipboard={false}
              />
              <pre>{`Data parsed in ${this.state.perf.waistInseamData} milliseconds.`}</pre>
              <h3>Dimension Queries</h3>
              <h4>Query by colorName and waist</h4>
              <pre>{`{ colorName: 'BLUE', waist: 'W30' }`}</pre>
              {DevelopmentApp.getQueryTable(waistInseamData, ['skuId', 'colorName', 'sizeName', 'waist', 'inseam'], { colorName: 'BLUE', waist: 'W30' })}
              <hr />
              <h4>Query by colorName and waist</h4>
              <pre>{`{ colorName: 'BLUE', waist: 'W36' }`}</pre>
              {DevelopmentApp.getQueryTable(waistInseamData, ['skuId', 'colorName', 'sizeName', 'waist', 'inseam'], { colorName: 'BLUE', waist: 'W36' })}
              <hr />
              <h4>Query by colorName and inseam</h4>
              <pre>{`{ colorName: 'BLUE', inseam: 'L30' }`}</pre>
              {DevelopmentApp.getQueryTable(waistInseamData, ['skuId', 'colorName', 'sizeName', 'waist', 'inseam'], { colorName: 'BLUE', inseam: 'L30' })}
              <hr />
              <h4>Query by waist and inseam</h4>
              <pre>{`{ waist: 'W30', inseam: 'L30' }`}</pre>
              {DevelopmentApp.getQueryTable(waistInseamData, ['skuId', 'colorName', 'sizeName', 'waist', 'inseam'], { waist: 'W30', inseam: 'L30' })}
              <h3>Entry Queries</h3>
              <pre>{`{ waist: 'W28', colorName: 'BLUE', inseam: 'L30' }`}</pre>
              {DevelopmentApp.getQueryTable(waistInseamData, ['skuId', 'colorName', 'sizeName', 'waist', 'inseam'], { waist: 'W28', colorName: 'BLUE', inseam: 'L30' }, 'getEntry')}
              <hr />
              <pre>{`{ waist: 'W36', colorName: 'BLUE', inseam: 'L28' }`}</pre>
              {DevelopmentApp.getQueryTable(waistInseamData, ['skuId', 'colorName', 'sizeName', 'waist', 'inseam'], { waist: 'W36', colorName: 'BLUE', inseam: 'L28' }, 'getEntry')}
            </div>}
          </section>
        )}

        { (this.state.value === '3') && (
          <section id="example--3">
            <h2>4 Order Matrix: Color, Size Extensions, Waist, and Inseam</h2>
            {waistInseamData && <div>
              <h3>Matrix Data</h3>
              <ReactJson
                src={waistSizeExtensionsData.debug()}
                theme="monokai"
                iconStyle="triangle"
                name="waistSizeExtensionsData"
                collapsed={1}
                enableClipboard={false}
              />
              <pre>{`Data parsed in ${this.state.perf.waistSizeExtensionsData} milliseconds.`}</pre>
              <h3>Dimension Queries</h3>
              <h4>Query by colorName, extension and waist</h4>
              <pre>{`{ colorName: 'BLUE', extension: 'Regular', waist: 'W30' }`}</pre>
              {DevelopmentApp.getQueryTable(waistSizeExtensionsData, ['skuId', 'colorName', 'sizeName', 'extension', 'waist', 'inseam'], { colorName: 'BLUE', extension: 'Regular', waist: 'W30' })}
              <hr />
              <h4>Query by colorName, extension, and inseam</h4>
              <pre>{`{ colorName: 'BLUE', extension: 'Regular', inseam: 'L30' }`}</pre>
              {DevelopmentApp.getQueryTable(waistSizeExtensionsData, ['skuId', 'colorName', 'sizeName', 'extension', 'waist', 'inseam'], { colorName: 'BLUE', extension: 'Regular', inseam: 'L30' })}
              <hr />
              <h4>Query by colorName, waist, and inseam</h4>
              <pre>{`{ colorName: 'BLUE', waist: 'W30', inseam: 'L30' }`}</pre>
              {DevelopmentApp.getQueryTable(waistSizeExtensionsData, ['skuId', 'colorName', 'sizeName', 'extension', 'waist', 'inseam'], { colorName: 'BLUE', waist: 'W30', inseam: 'L30' })}
              <hr />
              <h4>Query by extension, waist, and inseam</h4>
              <pre>{`{ extension: 'Regular', waist: 'W30', inseam: 'L30' }`}</pre>
              {DevelopmentApp.getQueryTable(waistSizeExtensionsData, ['skuId', 'colorName', 'sizeName', 'extension', 'waist', 'inseam'], { extension: 'Regular', waist: 'W30', inseam: 'L30' })}
              <h3>Entry Queries</h3>
              <pre>{`{ waist: 'W28', colorName: 'BLUE', extension: 'Regular', inseam: 'L30' }`}</pre>
              {DevelopmentApp.getQueryTable(waistSizeExtensionsData, ['skuId', 'colorName', 'sizeName', 'extension', 'waist', 'inseam'], { waist: 'W28', colorName: 'BLUE', extension: 'Regular', inseam: 'L30' }, 'getEntry')}
            </div>}
          </section>
        )}

        { (this.state.value === '4') && (
          <section id="example--4">
            <h2>4 Order Matrix: Waist, Inseam, Size Extensions, and Color</h2>
            {waistInseamData && <div>
              <h3>Matrix Data</h3>
              <ReactJson
                src={waistSizeExtensionsColorData.debug()}
                theme="monokai"
                iconStyle="triangle"
                name="waistSizeExtensionsData"
                collapsed={1}
                enableClipboard={false}
              />
              <pre>{`Data parsed in ${this.state.perf.waistSizeExtensionsColorData} milliseconds.`}</pre>
              <h3>Dimension Queries</h3>
              <h4>Query by colorName, extension and waist</h4>
              <pre>{`{ colorName: 'BLUE', extension: 'Regular', waist: 'W30' }`}</pre>
              {DevelopmentApp.getQueryTable(waistSizeExtensionsColorData, ['skuId', 'colorName', 'sizeName', 'extension', 'waist', 'inseam'], { colorName: 'BLUE', extension: 'Regular', waist: 'W30' })}
              <hr />
              <h4>Query by colorName, extension, and inseam</h4>
              <pre>{`{ colorName: 'BLUE', extension: 'Regular', inseam: 'L30' }`}</pre>
              {DevelopmentApp.getQueryTable(waistSizeExtensionsColorData, ['skuId', 'colorName', 'sizeName', 'extension', 'waist', 'inseam'], { colorName: 'BLUE', extension: 'Regular', inseam: 'L30' })}
              <hr />
              <h4>Query by colorName, waist, and inseam</h4>
              <pre>{`{ colorName: 'BLUE', waist: 'W30', inseam: 'L30' }`}</pre>
              {DevelopmentApp.getQueryTable(waistSizeExtensionsColorData, ['skuId', 'colorName', 'sizeName', 'extension', 'waist', 'inseam'], { colorName: 'BLUE', waist: 'W30', inseam: 'L30' })}
              <hr />
              <h4>Query by extension, waist, and inseam</h4>
              <pre>{`{ extension: 'Regular', waist: 'W30', inseam: 'L30' }`}</pre>
              {DevelopmentApp.getQueryTable(waistSizeExtensionsColorData, ['skuId', 'colorName', 'sizeName', 'extension', 'waist', 'inseam'], { extension: 'Regular', waist: 'W30', inseam: 'L30' })}
              <h3>Entry Queries</h3>
              <pre>{`{ waist: 'W28', colorName: 'BLUE', extension: 'Regular', inseam: 'L30' }`}</pre>
              {DevelopmentApp.getQueryTable(waistSizeExtensionsColorData, ['skuId', 'colorName', 'sizeName', 'extension', 'waist', 'inseam'], { waist: 'W28', colorName: 'BLUE', extension: 'Regular', inseam: 'L30' }, 'getEntry')}
            </div>}
          </section>
        )}

        { (this.state.value === '5') && (
          <section id="example--5">
            <h2>4 Order Matrix with Missing Data</h2>
            {missingExtensionsData && <div>
              <h3>Matrix Data</h3>
              <ReactJson
                src={missingExtensionsData.debug()}
                theme="monokai"
                iconStyle="triangle"
                name="waistSizeExtensionsData"
                collapsed={1}
                enableClipboard={false}
              />
              <pre>{`Data parsed in ${this.state.perf.missingExtensionsData} milliseconds.`}</pre>
              <h3>Dimension Queries</h3>
              <h4>Query by colorName, extension and waist</h4>
              <pre>{`{ colorName: 'KHAKI', ext: 'regular', size: '29' }`}</pre>
              {DevelopmentApp.getQueryTable(missingExtensionsData, ['skuId', 'colorName', 'ext', 'size', 'inseam'], { colorName: 'KHAKI', ext: 'regular', size: '29' })}
            </div>}
          </section>
        )}

        { (this.state.value === '6') && (
          <section id="example--6">
            <h2>3 Order Matrix: Color, Size Extensions, and Sizes (Null set)</h2>
            {sizeExtensionsNullSetData && <div>
              <h3>Matrix Data</h3>
              <ReactJson
                src={sizeExtensionsNullSetData.debug()}
                theme="monokai"
                iconStyle="triangle"
                collapsed={1}
                name="sizeExtensions"
                enableClipboard={false}
              />
              <pre>{`Data parsed in ${this.state.perf.sizeExtensionsData} milliseconds.`}</pre>
              <h3>Dimension Queries</h3>
              <h4>Query by extension and size</h4>
              <pre>{`{ extension: 'Regular', size: 'M' }`}</pre>
              {DevelopmentApp.getQueryTable(sizeExtensionsNullSetData, ['skuId', 'colorName', 'extension', 'size'], { extension: 'Regular', size: 'M' })}
              <hr />
            </div>}
          </section>
        )}
      </div>
    );
  }
}
export default DevelopmentApp;
