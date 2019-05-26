// /* eslint-disable */
// import React from 'react'
// import querystring from 'querystring'

// import { cloneObj, objectMap } from '@atlaskit/refinement-bar/utils'
// import {
//   AvatarAsyncSelectFilter,
//   IssueSelectFilter,
//   NumberFilter,
//   SelectFilter,
//   SearchFilter,
//   TextFilter,
//   RefinementBarUI,
//   RefinementBarProvider,
//   RefinementBarConsumer,
// } from '@atlaskit/refinement-bar'

// // ==============================
// // APP EXAMPLE
// // ==============================

// class RefinementBarExample extends React.Component {
//   state = { value: decodeQuery() }

//   onChange = (value, meta) => {
//     switch (meta.action) {
//       case 'add':
//         this.addValue({ [meta.key]: meta.data })
//         break
//       case 'remove':
//         this.removeValue(meta.key)
//         break
//       case 'update':
//       case 'clear':
//         this.updateValue(value)
//         break
//       default:
//     }
//   }

//   addValue = (add) => {
//     const value = cloneObj(this.state.value, { add })
//     this.setState({ value })
//   }

//   removeValue = (remove) => {
//     const value = cloneObj(this.state.value, { remove })
//     this.setState({ value })
//   }

//   updateValue = value => {
//     this.setState({ value })
//   }

//   // render() {
//   //   return (
//   //     <RefinementBar
//   //       fieldConfig={FIELD_CONFIG}
//   //       irremovableKeys={['search', 'issue-assignee', 'issue-type']}
//   //       onChange={this.onChange}
//   //       value={this.state.value}
//   //     />
//   //   );
//   // }

//   render() {
//     return (
//       <RefinementBarProvider
//         fieldConfig={FIELD_CONFIG}
//         irremovableKeys={['search', 'issue-assignee', 'issue-type']}
//         onChange={this.onChange}
//         value={this.state.value}
//       >
//         <div style={{ padding: 40 }}>
//           <RefinementBarConsumer>{encodeQuery}</RefinementBarConsumer>
//           <RefinementBarUI />
//           <RefinementBarConsumer>
//             {({ value }) => (
//               <>
//                 <Heading>Values</Heading>
//                 <Pre>{Object.entries(value).map(dataMap)}</Pre>
//               </>
//             )}
//           </RefinementBarConsumer>
//         </div>
//       </RefinementBarProvider>
//     )
//   }
// }

// // ==============================
// // DATA
// // ==============================

// const CAPITALS = [
//   { label: 'Adelaide', value: 'adelaide' },
//   { label: 'Brisbane', value: 'brisbane' },
//   { label: 'Canberra', value: 'canberra' },
//   { label: 'Darwin', value: 'darwin' },
//   { label: 'Hobart', value: 'hobart' },
//   { label: 'Melbourne', value: 'melbourne' },
//   { label: 'Perth', value: 'perth' },
//   { label: 'Sydney', value: 'sydney' },
// ]

// const FIELD_CONFIG = {
//   approvals: {
//     label: 'Approvals',
//     type: SelectFilter,
//     options: CAPITALS,
//   },
//   browser: {
//     label: 'Browser',
//     type: TextFilter,
//     note: 'The browser(s) in which this issue is reproducible (if any)',
//   },
//   comment: {
//     label: 'Comment',
//     type: TextFilter,
//   },
//   description: {
//     label: 'Description',
//     type: TextFilter,
//     validateValue: ({ type, value }) => {
//       const INVALID_FIRST_CHARS = ['*', '?']
//       const defaultReturn = { message: null, isInvalid: false }

//       if (type === 'is_not_set') {
//         return defaultReturn
//       }
//       if (!value) {
//         return { message: 'Please provide some text.', isInvalid: true }
//       }
//       if (INVALID_FIRST_CHARS.includes(value.charAt(0))) {
//         return {
//           message:
//             "The '*' and '?' are not allowed as first character in a 'wildard' search.",
//           isInvalid: true,
//         }
//       }

//       return defaultReturn
//     },
//   },
//   votes: {
//     label: 'Votes',
//     type: NumberFilter,
//   },
//   search: {
//     label: 'Search',
//     type: SearchFilter,
//   },
//   'issue-type': {
//     type: IssueSelectFilter,
//     label: 'Type',
//     options: [
//       {
//         label: 'Issue Types',
//         options: [
//           { value: 'all-standard', label: 'All standard issue types' },
//           { value: 'all-sub-task', label: 'All sub-task issue types' },
//         ],
//       },
//       {
//         label: 'Standard Issue Types',
//         options: [
//           { value: 'bug', type: 'bug', label: 'Bug' },
//           { value: 'changes', type: 'changes', label: 'Changes' },
//           { value: 'epic', type: 'epic', label: 'Epic' },
//           { value: 'improvement', type: 'improvement', label: 'Improvement' },
//           { value: 'incident', type: 'incident', label: 'Incident' },
//           { value: 'new-feature', type: 'new-feature', label: 'New feature' },
//           { value: 'problem', type: 'problem', label: 'Problem' },
//           { value: 'question', type: 'question', label: 'Question' },
//           { value: 'story', type: 'story', label: 'Story' },
//           { value: 'subtask', type: 'subtask', label: 'Subtask' },
//           { value: 'task', type: 'task', label: 'Task' },
//         ],
//       },
//     ],
//   },
//   'issue-assignee': {
//     type: AvatarAsyncSelectFilter,
//     label: 'Assignee',
//     cacheOptions: true,
//     defaultOptions: [
//       {
//         value: '__current-user',
//         label: 'Current User',
//         avatar: `http://i.pravatar.cc/48?u=__current-user`,
//       },
//       {
//         value: '__unassigned',
//         label: 'Unassigned',
//         avatar: null,
//       },
//     ],
//     // this will likely be rate limited with the amount of traffic the website gets.
//     // remove before pushing to production
//     loadOptions: async inputValue => {
//       const response = await fetch(
//         'https://api.github.com/repos/facebook/react/contributors',
//       ).then(r => r.json())

//       return response
//         .filter(u => u.login.toLowerCase().includes(inputValue.toLowerCase()))
//         .sort((a, b) => b.contributions - a.contributions)
//         .map(u => ({
//           avatar: u.avatar_url,
//           label: u.login,
//           value: u.login,
//         }))
//     },
//     // loadOptions: inputValue =>
//     //   new Promise(resolve => {
//     //     setTimeout(() => {
//     //       resolve(filterAssignees(inputValue));
//     //     }, 1000);
//     //   }),
//   },
// }

// // ==============================
// // STYLED COMPONENTS
// // ==============================

// const Pre = props => (
//   <pre
//     css={{
//       backgroundColor: '#F4F5F7',
//       borderRadius: 4,
//       boxSizing: 'border-box',
//       color: '#505F79',
//       flex: 1,
//       fontSize: '0.85rem',
//       lineHeight: 1.6,
//       maxWidth: '100%',
//       overflow: 'auto',
//       padding: 16,
//     }}
//     {...props}
//   />
// )
// const Heading = ({ children, ...props }) => (
//   <h4
//     css={{
//       margin: '1em 0 0',
//     }}
//     {...props}
//   >
//     {children}
//   </h4>
// )

// // ==============================
// // HELPERS
// // ==============================

// const dataMap = ([key, val]) => (
//   <div key={key}>
//     <code>
//       {key}: {JSON.stringify(val, null, 2)}
//     </code>
//   </div>
// )

// const decodeQuery = () => {
//   const params = querystring.parse(window.location.search.replace('?', ''))
//   const decoded = objectMap(params, (v, k) => {
//     if (Object.keys(FIELD_CONFIG).includes(k)) {
//       return JSON.parse(v)
//     }
//     return null
//   })

//   return decoded
// }

// const encodeQuery = values => {
//   const params = objectMap(values, (v, k) => {
//     if (Object.keys(FIELD_CONFIG).includes(k)) {
//       return JSON.stringify(v)
//     }
//     return null
//   })
//   const path = window.location.origin + window.location.pathname
//   const qs = `?${querystring.stringify(params)}`

//   window.history.replaceState({}, null, path + qs)

//   return null
// }

// export default () => <RefinementBarExample />
