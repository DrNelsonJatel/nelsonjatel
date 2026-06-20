// Applied water tools built for local government. The "Tools" tab appears in the
// nav automatically when this list is non-empty.

export interface Tool {
  name: string;
  description: string;   // site voice, no filler, Canadian spelling
  url: string;
}

export const TOOLS: Tool[] = [
  {
    name: 'temp.stream',
    description:
      'Monitors and forecasts stream temperature in Okanagan creeks, and flags when the ' +
      'thresholds that matter for fish and environmental flows are likely to be crossed, so ' +
      'managers can see a heat problem coming rather than read about it afterward.',
    url: 'https://temp.stream/',
  },
  {
    name: 'Okanagan Groundwater Risk Tool',
    description:
      'Brings groundwater into the drought picture. It tracks conditions across Okanagan ' +
      'aquifers and shows where levels are trending toward stress, alongside the surface ' +
      'water that most monitoring already covers.',
    url: 'https://obwb.shinyapps.io/ok-gw/',
  },
  {
    name: 'State of the Okanagan Reservoirs',
    description:
      'A real-time read on storage across the valley’s mainstem lakes and upland ' +
      'reservoirs: the water actually in the bank heading into a season.',
    url: 'https://obwb.shinyapps.io/ok-reservoirs/',
  },
];
