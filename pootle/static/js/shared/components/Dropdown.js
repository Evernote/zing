/*
 * Copyright (C) Zing contributors.
 *
 * This file is a part of the Zing project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import React from 'react';

import './Dropdown.css';


class Dropdown extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isInitiallyOpen,
    };

    this.clickedInside = false;
    this.clickTimeout = null;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleDocClick = this.handleDocClick.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isOpen && this.state.isOpen) {
      document.addEventListener('keydown', this.handleKeyDown);
      document.addEventListener('click', this.handleDocClick);
    }
    if (prevState.isOpen && !this.state.isOpen) {
      document.removeEventListener('keydown', this.handleKeyDown);
      document.removeEventListener('click', this.handleDocClick);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.clickTimeout);
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('click', this.handleDocClick);
  }

  handleDocClick() {
    if (this.clickedInside) {
      return;
    }

    this.setState({
      isOpen: false,
    });
  }

  handleKeyDown(e) {
    if (e.key === 'Escape') {
      this.setState({
        isOpen: false,
      });
    }
  }

  handleContainerMouseDown() {
    this.clickedInside = true;
  }

  handleContainerMouseUp() {
    this.clickTimeout = setTimeout(() => (this.clickedInside = false), 0);
  }

  handleTriggerClick() {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  }

  render() {
    return (
      <div
        className="dropdown-wrapper"
      >
        <div onClick={() => this.handleTriggerClick()} >
          {this.props.trigger}
        </div>
        {this.state.isOpen &&
          <div
            className="dropdown-container"
            onMouseDown={() => this.handleContainerMouseDown()}
            onMouseUp={() => this.handleContainerMouseUp()}
            tabIndex="0"
          >
          {React.Children.only(this.props.children)}
          </div>
        }
      </div>
    );
  }
}

Dropdown.propTypes = {
  isInitiallyOpen: React.PropTypes.bool,
  trigger: React.PropTypes.node.isRequired,
  children: React.PropTypes.node.isRequired,
};

Dropdown.defaultProps = {
  isInitiallyOpen: false,
};


export default Dropdown;
