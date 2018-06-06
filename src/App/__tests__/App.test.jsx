import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../App';

configure({ adapter: new Adapter() });


describe('<App />', () => {
  global.performance = { now: () => {} };

  it('should render the demo app', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.exists()).toBe(true);
  });
  it('should call handleChange when a select is changed', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.state('value')).toBe('0');
    wrapper.find('.select').simulate('change', { target: { value: '2' } });
    wrapper.update();
    expect(wrapper.state('value')).toBe('2');
  });
  it('should render example 1', () => {
    const wrapper = shallow(<App />);
    wrapper.find('.select').simulate('change', { target: { value: '0' } });
    wrapper.update();
    expect(wrapper.find('#example--0').length).toBe(1);
  });
  it('should render example 2', () => {
    const wrapper = shallow(<App />);
    wrapper.find('.select').simulate('change', { target: { value: '1' } });
    wrapper.update();
    expect(wrapper.find('#example--1').length).toBe(1);
  });
  it('should render example 3', () => {
    const wrapper = shallow(<App />);
    wrapper.find('.select').simulate('change', { target: { value: '2' } });
    wrapper.update();
    expect(wrapper.find('#example--2').length).toBe(1);
  });
  it('should render example 4', () => {
    const wrapper = shallow(<App />);
    wrapper.find('.select').simulate('change', { target: { value: '3' } });
    wrapper.update();
    expect(wrapper.find('#example--3').length).toBe(1);
  });
  it('should render example 5', () => {
    const wrapper = shallow(<App />);
    wrapper.find('.select').simulate('change', { target: { value: '4' } });
    wrapper.update();
    expect(wrapper.find('#example--4').length).toBe(1);
  });
  it('should render example 6', () => {
    const wrapper = shallow(<App />);
    wrapper.find('.select').simulate('change', { target: { value: '5' } });
    wrapper.update();
    expect(wrapper.find('#example--5').length).toBe(1);
  });
  it('should render example 7', () => {
    const wrapper = shallow(<App />);
    wrapper.find('.select').simulate('change', { target: { value: '6' } });
    wrapper.update();
    expect(wrapper.find('#example--6').length).toBe(1);
  });
});
