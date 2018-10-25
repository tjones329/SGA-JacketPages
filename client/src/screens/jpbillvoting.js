import React from 'react';

class JPBillVoting extends React.Component {
  constructor(props) {
    super(props);
    this.state = { present: false };
  }

  render() {
    if (!this.state.present) {
      return (
        <div>
          You must be marked present at the meeting in order to vote.
        </div>
      );
    }
  }
}

export default JPBillVoting;