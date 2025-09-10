'use client';

import React from 'react';

class DragDropErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Drag & Drop Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h2 className="text-lg font-semibold text-yellow-800">Drag & Drop Temporarily Unavailable</h2>
          <p className="text-yellow-700">Please refresh the page to restore drag and drop functionality.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DragDropErrorBoundary;