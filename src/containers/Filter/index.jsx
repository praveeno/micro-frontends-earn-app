import React, { useEffect, useState } from "react";
import PT from "prop-types";
import { connect } from "react-redux";
import ChallengeFilter from "./ChallengeFilter";
import actions from "../../actions";

const Filter = ({
  bucket,
  types,
  tracks,
  tags,
  prizeFrom,
  prizeTo,
  subCommunities,
  challengeBuckets,
  challengeTypes,
  challengeTracks,
  challengeTags,
  challengeSubCommunities,
  updateFilter,
  getChallenges,
  getTags,
  getSubCommunities,
}) => {
  useEffect(() => {
    getTags();
    getSubCommunities();
  }, []);

  const onSaveFilter = (filter) => {
    updateFilter(filter);
    getChallenges(filter);
  };

  return (
    <ChallengeFilter
      bucket={bucket}
      types={types}
      tracks={tracks}
      tags={tags}
      prizeFrom={prizeFrom}
      prizeTo={prizeTo}
      subCommunities={subCommunities}
      challengeBuckets={challengeBuckets}
      challengeTypes={challengeTypes}
      challengeTracks={challengeTracks}
      challengeTags={challengeTags}
      challengeSubCommunities={challengeSubCommunities}
      saveFilter={onSaveFilter}
      clearFilter={() => {}}
    />
  );
};

Filter.propTypes = {
  bucket: PT.string,
  types: PT.arrayOf(PT.string),
  tracks: PT.arrayOf(PT.string),
  tags: PT.arrayOf(PT.string),
  prizeFrom: PT.number,
  prizeTo: PT.number,
  subCommunities: PT.arrayOf(PT.string),
  challengeBuckets: PT.arrayOf(PT.string),
  challengeTypes: PT.arrayOf(PT.string),
  challengeTracks: PT.arrayOf(PT.string),
  challengeTags: PT.arrayOf(PT.string),
  challengeSubCommunities: PT.arrayOf(PT.string),
  updateFilter: PT.func,
  getChallenges: PT.func,
  getTags: PT.func,
  getSubCommunities: PT.func,
};

const mapStateToProps = (state) => ({
  state: state,
  bucket: state.filter.challenge.bucket,
  types: state.filter.challenge.types,
  tracks: state.filter.challenge.tracks,
  tags: state.filter.challenge.tags,
  prizeFrom: state.filter.challenge.prizeFrom,
  prizeTo: state.filter.challenge.prizeTo,
  subCommunities: state.filter.challenge.subCommunities,
  challengeBuckets: state.lookup.buckets,
  challengeTypes: state.lookup.types,
  challengeTracks: state.lookup.tracks,
  challengeTags: state.lookup.tags,
  challengeSubCommunities: state.lookup.subCommunities,
});

const mapDispatchToProps = {
  updateFilter: actions.filter.updateFilter,
  getChallenges: actions.challenges.getChallenges,
  getTags: actions.lookup.getTags,
  getSubCommunities: actions.lookup.getCommunityList,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  getChallenges: (change) =>
    dispatchProps.getChallenges(
      { ...stateProps.state.filter.challenge, ...change },
      change
    ),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Filter);