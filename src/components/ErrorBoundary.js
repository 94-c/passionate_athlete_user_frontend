import React, { Component } from 'react';
import '../styles/ErrorBoundary.css'; // CSS 파일 추가

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 오류가 발생하면 상태를 업데이트하여 대체 UI를 렌더링
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 오류 정보를 콘솔에 출력
    console.error("ErrorBoundary에서 오류를 잡았습니다", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 오류가 발생했을 때 보여줄 사용자 친화적인 메시지
      return (
        <div className="error-boundary">
          <h1>죄송합니다! 문제가 발생했습니다.</h1>
          <p>문제가 발생하여 페이지를 불러올 수 없습니다. 페이지를 새로고침하거나 나중에 다시 시도해주세요.</p>
          <button onClick={() => window.location.reload()} className="error-boundary-button">페이지 새로고침</button>
        </div>
      );
    }

    // 문제가 없을 경우 자식 컴포넌트를 렌더링
    return this.props.children;
  }
}

export default ErrorBoundary;
