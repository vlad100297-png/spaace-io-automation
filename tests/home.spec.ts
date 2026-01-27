import { test, expect } from '@playwright/test';

test.describe('Spaace home page', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders root structure and primary layout containers', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('body.main-wrapper')).toBeVisible();
    await expect(page.locator('header')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(2);
  });

  test('renders header branding, navigation, and search input', async ({ page }) => {
    const header = page.locator('header');
    await expect(header.locator('a[href="/"] svg.baseLogo__logo')).toHaveCount(1);
    expect(await header.locator('nav[aria-label="Main"]').count()).toBeGreaterThan(0);
    expect(await header.locator('a[href="/collections"]').count()).toBeGreaterThan(0);
    await expect(header.getByPlaceholder('Search collections...')).toHaveCount(1);
  });

  test('hero section shows headline, description, and primary CTA', async ({ page }) => {
    const heroHeading = page.getByRole('heading', { name: /Trade NFTs\. Level Up\.?\s*Earn Rewards\./ });
    await expect(heroHeading).toBeVisible();
    await expect(page.getByText('Chapter 2 is live.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enter the Battle Pass' })).toHaveCount(1);
  });

  test('hero imagery includes expected alt text', async ({ page }) => {
    await expect(page.locator('img[alt="First Section Background"]')).toHaveCount(1);
    await expect(page.locator('img[alt="First Section Card"]')).toHaveCount(1);
    await expect(page.locator('img[alt="First Section Card 3"]')).toHaveCount(1);
    await expect(page.locator('img[alt="First Section Card 4"]')).toHaveCount(1);
  });

  test('primary CTAs and navigation controls are clickable', async ({ page }) => {
    const ctas = [
      page.getByRole('button', { name: 'Enter the Battle Pass' }),
      page.getByRole('button', { name: 'Play' }).first(),
      page.getByRole('button', { name: 'Invite Friends' }),
      page.getByRole('button', { name: 'Enter the experience' }),
      page.getByRole('button', { name: 'Collector' }),
      page.getByRole('button', { name: 'Pro' }),
      page.getByRole('link', { name: 'Sell Now' }).first(),
      page.getByRole('link', { name: 'Collections' }).first(),
    ];

    for (const cta of ctas) {
      await expect(cta).toBeVisible();
      await cta.click({ trial: true });
    }
  });

  test('trending collections section renders heading and cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Trending Collections' })).toBeVisible();
    await expect(page.getByText('The most popular collections on the platform')).toBeVisible();

    const cardLinks = page.locator('a[href^="/collections/"]');
    expect(await cardLinks.count()).toBeGreaterThan(3);

    await expect(page.getByText('Moonbirds').first()).toBeVisible();
    await expect(page.getByText('Mutant Ape Yacht CIub').first()).toBeVisible();
    await expect(page.getByText('Pudgy Penguins').first()).toBeVisible();
    await expect(page.getByText('CryptoPunks').first()).toBeVisible();
  });

  test('trade section tabs toggle active state', async ({ page }) => {
    const tradeSection = page.locator('section', {
      has: page.getByRole('heading', { name: 'Trade NFTs, Earn XP' }),
    }).first();

    const highestVolume = tradeSection.getByRole('tab', { name: 'Highest Volume' });
    const mostSales = tradeSection.getByRole('tab', { name: 'Most Sales' });
    await expect(highestVolume).toHaveAttribute('aria-selected', 'true');

    await mostSales.click();
    await expect(mostSales).toHaveAttribute('aria-selected', 'true');
    await expect(highestVolume).toHaveAttribute('aria-selected', 'false');
  });

  test('trade section time range tabs toggle active state', async ({ page }) => {
    const tradeSection = page.locator('section', {
      has: page.getByRole('heading', { name: 'Trade NFTs, Earn XP' }),
    }).first();

    const tab24h = tradeSection.getByRole('tab', { name: '24H' });
    const tab7d = tradeSection.getByRole('tab', { name: '7D' });
    await expect(tab24h).toHaveAttribute('aria-selected', 'true');

    await tab7d.click();
    await expect(tab7d).toHaveAttribute('aria-selected', 'true');
    await expect(tab24h).toHaveAttribute('aria-selected', 'false');
  });

  test('invite friends section shows steps and CTA', async ({ page }) => {
    const inviteSection = page.locator('section', {
      has: page.getByRole('heading', { name: 'Invite Friends to Earn Exclusive Rewards' }),
    }).first();

    await expect(inviteSection.getByRole('heading', { name: 'Share your Referral Card' })).toBeVisible();
    await expect(inviteSection.getByRole('heading', { name: 'Earn XP' })).toBeVisible();
    await expect(inviteSection.getByRole('heading', { name: 'Earn ETH' })).toBeVisible();
    await expect(inviteSection.getByRole('button', { name: 'Invite Friends' })).toHaveCount(1);
  });

  test('referral ambassadors marquee renders call to action', async ({ page }) => {
    const marquee = page.getByText('Referral Ambassadors Program').first();
    await expect(marquee).toBeVisible();
    await expect(page.getByRole('button', { name: 'Apply' }).first()).toBeVisible();
  });

  test('cashback section shows key feature blocks', async ({ page }) => {
    const cashbackSection = page.locator('section', {
      has: page.getByRole('heading', { name: 'Trade NFTs, Earn Cashback' }),
    }).first();

    await expect(cashbackSection.getByRole('heading', { name: 'Explore collections' })).toBeVisible();
    await expect(cashbackSection.getByRole('heading', { name: /Earn\s*\$SPAACE/ })).toBeVisible();
    await expect(cashbackSection.getByRole('heading', { name: 'Collect XP' })).toBeVisible();
  });

  test('video section includes overlay content and CTA', async ({ page }) => {
    const videoSection = page.getByText("Discover Spaace's Vision");
    await expect(videoSection).toBeVisible();

    const video = page.locator('video');
    await expect(video).toHaveCount(1);
    await expect(video).toHaveAttribute('autoplay', '');
    await expect(video).toHaveAttribute('loop', '');
    await expect(video).toHaveAttribute('playsinline', '');

    await expect(page.getByRole('button', { name: 'Enter the experience' })).toBeVisible();
  });

  test('footer contains social links and site navigation', async ({ page }) => {
    const mainFooter = page.locator('footer').first();
    await expect(mainFooter.getByRole('link', { name: 'Discord' })).toHaveAttribute('target', '_blank');
    await expect(mainFooter.getByRole('link', { name: 'X (Twitter)' })).toHaveAttribute('target', '_blank');

    await expect(mainFooter.getByRole('heading', { name: 'Marketplace' })).toBeVisible();
    await expect(mainFooter.getByRole('heading', { name: 'Rewards' })).toBeVisible();
    await expect(mainFooter.getByRole('heading', { name: 'My Account' })).toBeVisible();
    await expect(mainFooter.getByRole('heading', { name: 'Start Here' })).toBeVisible();

    await expect(mainFooter.getByRole('link', { name: 'Litepaper' })).toHaveAttribute('target', '_blank');
  });

  test('search input accepts and retains long input values', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search collections...');
    const longValue = 'x'.repeat(256);
    await searchInput.fill(longValue);
    await expect(searchInput).toHaveValue(longValue);
  });

  test('validation: page has no forms or required fields', async ({ page }) => {
    await expect(page.locator('form')).toHaveCount(0);
    await expect(page.locator('input[required]')).toHaveCount(0);
  });

  test('accessibility: live region and navigation labels are present', async ({ page }) => {
    await expect(page.locator('section[aria-live="polite"][aria-label="Notifications alt+T"]')).toHaveCount(1);
    expect(await page.locator('nav[aria-label="Main"]').count()).toBeGreaterThan(0);
  });
});
