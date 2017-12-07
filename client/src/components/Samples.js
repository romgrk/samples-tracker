import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import styled from 'styled-components'
import { withRouter } from 'react-router'

import alphabeticalSort from '../utils/alphabetical-sort'
import filterTags from '../utils/filter-tags'
import uniq from '../utils/uniq'
import { getNewSample } from '../models'
import Sort, {
  sort as sortSamples,
  getName as getSortName,
  sortCriteria
} from '../constants/sorting'
import Badge from './Badge'
import Button from './Button'
import Checkbox from './Checkbox'
import Dropdown from './Dropdown'
import Gap from './Gap'
import Icon from './Icon'
import Input from './Input'
import Label from './Label'
import Modal from './Modal'
import Sample from './Sample'
import SampleModal from './SampleModal'
import Spinner from './Spinner'
import EditableLabel from './EditableLabel'


class Samples extends React.Component {

  createNewSample = (template) => {
    this.props.onCreate(getNewSample(template))
  }

  render() {
    const {
      isLoading,
      data,
      ui,
      templates,
      users,
      completionFunctions,
      selectedId,
      selectedStepIndex,
      onChange,
      onChangeStatus,
      onCreate,
      onDelete,
      onError,
      addFile,
      deleteFile
    } = this.props

    const allSamples = Object.values(data)
    const samples = sortSamples(ui.sorting.criteria, filterTags(ui.filtering.tags, allSamples))

    const selectedSample = data[selectedId]

    const allTags = Array.from(allSamples.map(s => s.data.tags).reduce((acc, cur) => (cur.forEach(tag => acc.add(tag)), acc), new Set()))
    const filteredTags = new Set(ui.filtering.tags)

    const newSampleButton =
      <Button info
        loading={templates.isLoading || isLoading}
        iconAfter={ templates.isLoading ? undefined : 'chevron-down' } >
        Create New Sample
      </Button>

    const createSampleDropdown =
      <Dropdown trigger={newSampleButton}>
        {
          templates.data.map(template =>
            <Dropdown.Item key={template.id} onClick={() => this.createNewSample(template)}>
              { template.name }
            </Dropdown.Item>
          )
        }
      </Dropdown>

    const sortingDropdown =
      <Dropdown label={ui.sorting.criteria.map(getSortName).join(', ')}>
        {
          sortCriteria.map(criterion =>
            <Dropdown.Item key={criterion.k}
              onClick={() => this.props.setSortingCriteria([criterion.k])}
            >
              { criterion.name }
            </Dropdown.Item>
          )
        }
      </Dropdown>

    const tagsDropdown =
    <Dropdown label={
      ui.filtering.tags.join(', ') || <span>&nbsp;</span>
    }>
        <Dropdown.Content
          onClick={() => this.props.setFilteringTags([])  }
        >
          Clear all
        </Dropdown.Content>
        {
          alphabeticalSort(allTags).map(tag =>
            <Dropdown.Content key={tag}
              onClick={() => filteredTags.has(tag) ?
                this.props.deleteFilteringTag(tag) :
                this.props.addFilteringTag(tag)
              }
            >
              <Icon
                name={filteredTags.has(tag) ? 'check-square' : 'square'}
                marginRight={10}
              /> <Badge info>{ tag }</Badge>
            </Dropdown.Content>
          )
        }
      </Dropdown>

    return (
      <section className='Samples vbox'>

        <div className='row bg-dark border-left'>
          { createSampleDropdown }

          <div className='fill' />

          <Label>Sort by</Label> { sortingDropdown }

          <div className='fill' />

          <Label>Filter tags</Label> { tagsDropdown }

          <div className='fill' />

          <Checkbox onChange={this.props.setIncludeArchived}>
            Include archived samples
          </Checkbox>
        </div>

        <table className='Samples__table bordered'>
          <tr className='Samples__header Sample'>
            <td className='Sample__name'>Name</td>
            <td className='Sample__badges'></td>
            <td className='Sample__icon'></td>
            <td className='Sample__steps'></td>
            <td className='Sample__created'>Created</td>
            <td className='Sample__modified'>Modified</td>
            <td className='Sample__notes'>Notes</td>
          </tr>

          {
            samples.map(sample =>
              <Sample
                key={sample.data.id}
                sample={sample}
                onChange={onChange}
                onChangeStatus={onChangeStatus}
                onDelete={onDelete}
              />
            )
          }
          {
            samples.length === 0 &&
              <tr className='Sample__empty text-muted'>
                <td>
                  No sample to display here.
                </td>
              </tr>
          }
        </table>

        <div className='row bg-dark border-left border-top'>
          <div className='fill' />

          <div className='vcenter'>
            <span className='Step legend'>
              <div className='file-marker'/>
            </span>&nbsp;&nbsp;<Label>Has some file(s)</Label>
          </div>

          <Gap fill={10} />

          <div className='vcenter'>
            <span className='Step legend'>
              <div className='notes-marker'/>
            </span>&nbsp;&nbsp;<Label>Has notes</Label>
          </div>
        </div>

        <SampleModal
          isLoading={isLoading}
          id={selectedId}
          stepIndex={selectedStepIndex}
          sample={selectedSample}
          users={users}
          completionFunctions={completionFunctions}
          tags={allTags}
          onChange={onChange}
          onChangeStatus={onChangeStatus}
          onDelete={onDelete}
          onError={onError}
          addFile={addFile}
          deleteFile={deleteFile}
        />

      </section>
    )
  }
}

export default withRouter(pure(Samples))
