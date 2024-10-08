// This command is responsible for searching for PDF files on the "pdf-manuals" GitHub repository (hondatabase/pdf-manuals)
// and sending a list of matches to the user

import { Octokit } from '@octokit/rest';
import { SlashCommandBuilder } from 'discord.js';

import { client } from '../index.js';
import { GITHUB_ORG_URL } from '../config.js';

const octokit = new Octokit();

let pdfFiles = [];

async function fetchPDFFiles(owner, repo, path = '') {
	try {
		const { data } = await octokit.repos.getContent({ owner, repo, path });

		let files = [];

		for (const item of data) {

			if (item.type === 'file' && item.name.endsWith('.pdf')) {
				files.push(item.path);
				console.log(item.path);
			} else if (item.type === 'dir') {
				const moarFiles = await fetchPDFFiles(owner, repo, item.path);
				files = files.concat(moarFiles);
			}
		}

		return files;
	} catch {
		return [];
	}
}

export const data = new SlashCommandBuilder()
	.setName('pdf')
	.setDescription('Searches for a PDF file on the "pdf-manuals" GitHub repository.')
	.addStringOption(option => option.setName('query')
		.setDescription('The search query')
		.setRequired(true)
	);
export async function execute(interaction) {
	const query = interaction.options.getString('query');

	if (pdfFiles.length === 0) return interaction.reply({ content: 'I currently don\'t have access to GitHub. Try again later.', ephemeral: true });

	const matches = pdfFiles.filter(file => file.includes(query));

	if (matches.length === 0) return interaction.reply({ content: 'No matches found.', ephemeral: true });

	const fileList = matches.slice(0, 5).map(file => `[${file.split('.')[0]}](${GITHUB_ORG_URL}pdf-manuals/raw/main/${file})`).join('\n');

	await interaction.reply(`Query: \`${query}\`\n${fileList}`);
}

client.on('ready', () => {
	console.log('Fetching PDF files...');
	fetchPDFFiles('hondatabase', 'pdf-manuals')
		.then(files => {
			pdfFiles = files;
			console.log(files.length + ' PDF files fetched.');
		})
		.catch(() => console.log('Failed to fetch PDF files.'));
});