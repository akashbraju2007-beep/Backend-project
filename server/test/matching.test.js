const test = require('node:test');
const assert = require('node:assert');

// Test matching logic algorithm in isolation
test('SkillSwap Reciprocal Matching Engine Logic', async (t) => {
  const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Simulated listings database
  const mockListings = [
    {
      _id: 'listing_1',
      userId: 'user_alex',
      skillOffered: 'Python',
      skillWanted: 'Figma UI/UX',
      status: 'open'
    },
    {
      _id: 'listing_2',
      userId: 'user_maya',
      skillOffered: 'Figma UI/UX',
      skillWanted: 'Python',
      status: 'open'
    },
    {
      _id: 'listing_3',
      userId: 'user_liam',
      skillOffered: 'Calculus',
      skillWanted: 'Spanish',
      status: 'open'
    },
    {
      _id: 'listing_4',
      userId: 'user_sofia',
      skillOffered: 'spanish',
      skillWanted: 'CALCULUS',
      status: 'open'
    },
    {
      _id: 'listing_5',
      userId: 'user_other',
      skillOffered: 'Python',
      skillWanted: 'React',
      status: 'open'
    },
    {
      _id: 'listing_6',
      userId: 'user_closed',
      skillOffered: 'Figma UI/UX',
      skillWanted: 'Python',
      status: 'matched' // Closed/Matched
    },
    {
      _id: 'listing_7',
      userId: 'user_alex', // Self listing
      skillOffered: 'Figma UI/UX',
      skillWanted: 'Python',
      status: 'open'
    }
  ];

  // Function implementing the matching logic
  function findReciprocalMatches(myListing, allListings, currentUserId) {
    const offered = myListing.skillOffered.trim();
    const wanted = myListing.skillWanted.trim();

    const offeredRegex = new RegExp(`^${escapeRegex(wanted)}$`, 'i');
    const wantedRegex = new RegExp(`^${escapeRegex(offered)}$`, 'i');

    return allListings.filter((other) => {
      // Must not be self
      if (other.userId === currentUserId) return false;
      // Must be open
      if (other.status !== 'open') return false;
      // Must reciprocate: other offers what I want, other wants what I offer
      return offeredRegex.test(other.skillOffered.trim()) && wantedRegex.test(other.skillWanted.trim());
    });
  }

  await t.test('Alex (offers Python, wants Figma) matches Maya (offers Figma, wants Python)', () => {
    const alexListing = mockListings[0];
    const matches = findReciprocalMatches(alexListing, mockListings, 'user_alex');

    assert.strictEqual(matches.length, 1);
    assert.strictEqual(matches[0]._id, 'listing_2');
    assert.strictEqual(matches[0].userId, 'user_maya');
  });

  await t.test('Liam and Sofia match case-insensitively (Calculus/Spanish <-> spanish/CALCULUS)', () => {
    const liamListing = mockListings[2];
    const matches = findReciprocalMatches(liamListing, mockListings, 'user_liam');

    assert.strictEqual(matches.length, 1);
    assert.strictEqual(matches[0]._id, 'listing_4');
    assert.strictEqual(matches[0].userId, 'user_sofia');
  });

  await t.test('Excludes closed or matched listings', () => {
    const alexListing = mockListings[0];
    const matches = findReciprocalMatches(alexListing, mockListings, 'user_alex');

    // listing_6 is matched, so it should not be in the results
    const foundClosed = matches.some((m) => m._id === 'listing_6');
    assert.strictEqual(foundClosed, false);
  });

  await t.test('Excludes user\'s own listings (cannot match with self)', () => {
    const alexListing = mockListings[0];
    const matches = findReciprocalMatches(alexListing, mockListings, 'user_alex');

    // listing_7 belongs to user_alex, so it should not be matched
    const foundSelf = matches.some((m) => m.userId === 'user_alex');
    assert.strictEqual(foundSelf, false);
  });

  await t.test('Non-reciprocal listing (listing_5 offers Python, wants React) does not match Alex', () => {
    const alexListing = mockListings[0];
    const matches = findReciprocalMatches(alexListing, mockListings, 'user_alex');

    const foundUnrelated = matches.some((m) => m._id === 'listing_5');
    assert.strictEqual(foundUnrelated, false);
  });
});

