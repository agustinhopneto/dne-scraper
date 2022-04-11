import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class AppService {
  getHello() {
    return { message: 'Is working!' };
  }

  async scrapeData(url: string) {
    try {
      const browser = await puppeteer.launch({
        headless: true,
      });

      const page = await browser.newPage();

      await page.goto(url);

      await page.waitForSelector('div[class="col-lg-10 col-md-8"]', {
        timeout: 3000,
      });

      const items = await page.evaluate(() => {
        const body = document.querySelector(
          'div[class="col-lg-10 col-md-8"]',
        ).innerHTML;

        return body;
      });

      const keysMatchArray = [...items.matchAll(/(?<=<b>).*?(?=:)/gm)];
      const valuesMatchArray = [...items.matchAll(/(?<=9">).*?(?=<\/div>)/gm)];

      const keys = keysMatchArray.map(([key]) => key);
      const values = valuesMatchArray.map(([value]) => value);

      const image = await page.evaluate(() => {
        const body = document
          .querySelector('div[class="col-4 mx-auto col-lg-2 col-md-4"] img')
          .getAttribute('src');

        return body;
      });

      const info = keys.map((key, index) => ({
        key,
        value: values[index],
      }));

      await browser.close();

      return {
        info,
        image,
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
