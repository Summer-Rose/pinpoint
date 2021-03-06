import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchSurvey, sendSurvey, deleteSurvey } from '../../actions';
import TimeAgo from 'timeago-react';

import PageHeader from '../pageHeader/PageHeader';
import YesNoStats from '../numberStats/YesNoStats';
import CircleGraph from '../circleGraph/CircleGraph';

import '../../index.scss';
import './SurveyPreview.scss';


class SurveyPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showRecipients: false
        }
    }
      
    componentDidMount() {
        this.props.fetchSurvey(this.props.surveyId);
    }

    toggleRecipientsList() {
        this.setState({ showRecipients: this.state.showRecipients ? false : true});
    }

    renderRecipients(recipients) {
        return (
            <div className="recipientsList">
                <p>{recipients.map(e => e.email).join(", ")}</p>
            </div>
        )
    }
    
    renderToolbar(isDraft, isSent, className) {
        if (isDraft && !isSent) {
            return (
                <div className={className}>
                    <div>
                        <a id="edit" href={`/surveys/edit/${this.props.surveyId}`}><i className="far fa-edit"></i></a>
                    </div>
                    <div onClick={() => this.props.sendSurvey(this.props.surveyId)}>
                        <i className="far fa-envelope"></i>
                    </div>
                    <div onClick={() => this.props.deleteSurvey(this.props.surveyId, true)}>
                        <i className="far fa-trash-alt"></i>
                    </div>
                </div>
            );
        }
        return (
            <div className={className}>
                <div onClick={() => this.props.deleteSurvey(this.props.surveyId, true)}>
                    <i className="far fa-trash-alt"></i>
                </div>
            </div>
        )
    }

    renderContent(survey) {
        if (this.props.isLoading) {
            return (
                <PageHeader text="Loading..." />
            );
        }
        return [
            <PageHeader key="header" text={`${survey.surveyName} - Preview`} />,
            <div key="preview" className="SurveyPreview__preview">
                {this.renderToolbar(survey.isDraft, this.props.sendSuccessful, "SurveyPreview__preview--toolbar")}
                <div className="SurveyPreview__preview--email">
                    <div className="emailbox">
                        <p>From: {survey.fromEmail}</p>
                        <p>Subject: {survey.subject}</p>
                    </div>
                    <div className="emailBody">
                        <p>{survey.greeting}</p>
                        <p>{survey.body}</p>
                        <p className="question">{survey.question}</p>
                        <div className="answerBox">
                            <button className="btn btn--primaryDark">{survey.yesText}</button>
                            <button className="btn btn--primaryDark">{survey.noText}</button>
                        </div>
                        <p>{survey.goodbye}</p>
                        <p className="signature">{survey.signature}</p>
                    </div>
                </div>
                <div className="SurveyPreview__preview--stats">
                    <div className="graph">
                        <CircleGraph class="graph" color="primary" value={survey.yes + survey.no} total={survey.totalRecipients} label="response rate" />
                    </div> 
                    <div className="numbers"> 
                        <YesNoStats yesCount={survey.yes} noCount={survey.no} total={survey.totalRecipients}/>
                    </div>
                    {survey.isDraft && !this.props.sendSuccessful ? (<button onClick={() => this.props.sendSurvey(this.props.surveyId)} className="btn btn--yellow"><i className="far fa-envelope"></i> Send now</button>) : null} 
                </div>
            </div>,
            <div key="details" className="SurveyPreview__details">
                <div className="SurveyPreview__details--info">
                    <div className="SurveyPreview__details--dates">
                        <p>Date Created: {new Date(survey.dateCreated).toLocaleDateString() + " " + new Date(survey.dateCreated).toLocaleTimeString()}</p>
                        {survey.dateUpdated ? (<p>Date last updated: {new Date(survey.dateUpdated).toLocaleDateString() + " " + new Date(survey.dateUpdated).toLocaleTimeString()}</p>) : null}
                        {survey.isDraft ? (<p>This survey has not been sent yet</p>) : (<p>Date Sent: {new Date(survey.dateSent).toLocaleDateString() + " " + new Date(survey.dateSent).toLocaleTimeString()}</p>)}
                        {survey.lastResponded ? [<p className="date">Last response recieved: </p>,<TimeAgo datetime={new Date(survey.lastResponded)} />] : <p className="date">No one has responded to your survey yet</p>}
                    </div>
                    <div className="SurveyPreview__details--recipients">
                        <p>Total recipients: {survey.totalRecipients}</p>
                        <button className="login-btn" onClick={() => this.toggleRecipientsList()}>Click to view recipients</button>
                        {this.state.showRecipients ? this.renderRecipients(survey.recipients) : null}
                    </div>
                </div>
                {this.renderToolbar(survey.isDraft, this.props.sendSuccessful, "SurveyPreview__details--toolbar SurveyPreview__preview--toolbar")}
            </div>
        ];
    }

    render() {
        console.log(this.props);
        if (this.props.deleteSuccessful) {
            return <Redirect to="/dashboard" />
        }
        const  survey  = this.props.survey;
        return (
            <div className="SurveyPreview">
                {this.props.isSending && <p style={{ color: 'black'}}>Sending...</p>}
                {this.props.sendSuccessful && <p style={{ color: 'black'}}>Sent!</p>}
                {this.props.isSendError && <p style={{ color: 'black'}}>AN ERROR HAS OCCURED: {this.props.sendErrorMessage}</p>}
                {this.props.isDeleting && <p style={{ color: 'black'}}>Deleting...</p>}
                {this.props.deleteSuccessful && <p style={{ color: 'black'}}>Deleted!</p>}
                {this.props.isDeleteError && <p style={{ color: 'black'}}>AN ERROR HAS OCCURED: {this.props.deleteErrorMessage}</p>}    
                {this.renderContent(survey)}
            </div>
        )
    }
}
  
function mapStateToProps({ survey, sendStatus, deleteStatus }) {
    return { 
        survey:survey.survey,
        isLoading: survey.isLoading,
        isSending: sendStatus.isSending,
        sendSuccessful: sendStatus.sendSuccessful,
        isSendError: sendStatus.isError,
        sendErrorMessage: sendStatus.errorMessage,
        isDeleting: deleteStatus.isDeleting,
        deleteSuccessful: deleteStatus.deleteSuccessful,
        isDeleteError: deleteStatus.isError,
        deleteErrorMessage: deleteStatus.errorMessage
    };
}


export default withRouter(connect(mapStateToProps, { fetchSurvey, sendSurvey, deleteSurvey })(SurveyPreview));